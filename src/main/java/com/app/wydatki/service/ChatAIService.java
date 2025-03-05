package com.app.wydatki.service;

import com.app.wydatki.model.Budget;
import com.app.wydatki.model.ChatMessage;
import com.app.wydatki.model.User;
import com.app.wydatki.repository.BudgetRepository;
import com.app.wydatki.repository.ChatMessageRepository;
import com.app.wydatki.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatAIService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;

    public ChatMessage processUserMessage(String message, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatMessage userChatMessage = new ChatMessage();
        userChatMessage.setUser(user);
        userChatMessage.setContent(message);
        userChatMessage.setUserMessage(true);
        chatMessageRepository.save(userChatMessage);

        String context = prepareContext(user);
        
        String aiResponse = generateAIResponse(message, context, user);

        ChatMessage aiChatMessage = new ChatMessage();
        aiChatMessage.setUser(user);
        aiChatMessage.setContent(aiResponse);
        aiChatMessage.setUserMessage(false);
        aiChatMessage.setContext(context);
        return chatMessageRepository.save(aiChatMessage);
    }

    private String prepareContext(User user) {
        List<Budget> activeBudgets = budgetRepository.findCurrentActiveBudgets(user.getId());
        List<Budget> upcomingBudgets = budgetRepository.findUpcomingBudgets(user.getId());
        
        StringBuilder context = new StringBuilder();
        context.append("Active budgets:\n");
        for (Budget budget : activeBudgets) {
            context.append(String.format("- %s: %s PLN (remaining: %s PLN)\n",
                    budget.getName(),
                    budget.getAmount(),
                    budget.getRemainingAmount()));
        }
        
        context.append("\nUpcoming budgets:\n");
        for (Budget budget : upcomingBudgets) {
            context.append(String.format("- %s: %s PLN (starts: %s)\n",
                    budget.getName(),
                    budget.getAmount(),
                    budget.getStartDate()));
        }
        
        return context.toString();
    }

    private String generateAIResponse(String userMessage, String context, User user) {
        return generateSampleResponse(userMessage, context);
    }

    private String generateSampleResponse(String userMessage, String context) {
        String lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.contains("pomoc") || lowerMessage.contains("help")) {
            return "Oto jak mogę Ci pomóc:\n" +
                   "1. Mogę pokazać Twoje aktywne budżety\n" +
                   "2. Mogę doradzić w planowaniu wydatków\n" +
                   "3. Mogę pomóc w analizie wydatków\n" +
                   "4. Mogę zasugerować oszczędności\n" +
                   "Co Cię interesuje?";
        }
        
        if (lowerMessage.contains("budżet") || lowerMessage.contains("budzet")) {
            return "Oto Twoje aktualne budżety:\n" + context;
        }
        
        if (lowerMessage.contains("oszczędności") || lowerMessage.contains("oszczednosci")) {
            return "Oto kilka wskazówek jak oszczędzać:\n" +
                   "1. Ustaw miesięczny limit wydatków\n" +
                   "2. Kategoryzuj wydatki\n" +
                   "3. Unikaj impulsywnych zakupów\n" +
                   "4. Porównuj ceny przed zakupem\n" +
                   "5. Używaj promocji i zniżek";
        }
        
        if (lowerMessage.contains("wydatki") || lowerMessage.contains("wydatek")) {
            return "Aby lepiej kontrolować wydatki:\n" +
                   "1. Regularnie sprawdzaj stan budżetu\n" +
                   "2. Ustaw powiadomienia o przekroczeniu limitu\n" +
                   "3. Analizuj trendy wydatków\n" +
                   "4. Planuj większe wydatki z wyprzedzeniem";
        }
        
        return "Przepraszam, nie rozumiem Twojego pytania. Czy możesz je sformułować inaczej? " +
               "Mogę pomóc w zarządzaniu budżetem, planowaniu wydatków i oszczędzaniach.";
    }

    public List<ChatMessage> getUserChatHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return chatMessageRepository.findByUserOrderByTimestampDesc(user);
    }
} 
package com.app.wydatki.controller;

import com.app.wydatki.enums.Category;
import com.app.wydatki.model.Budget;
import com.app.wydatki.model.Transaction;
import com.app.wydatki.service.BudgetService;
import com.app.wydatki.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ViewController {

    private final BudgetService budgetService;
    private final TransactionService transactionService;

    @GetMapping("/")
    public String home() {
        return "redirect:/dashboard";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
    
    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        if (userDetails == null) {
            return "redirect:/login";
        }
        
        String username = userDetails.getUsername();
        
        // Pobierz aktywne budżety
        List<Budget> activeBudgets = budgetService.getActiveBudgets(username);
        model.addAttribute("activeBudgets", activeBudgets);
        
        // Pobierz ostatnie transakcje
        LocalDate startDate = LocalDate.now().minusMonths(1);
        LocalDate endDate = LocalDate.now();
        List<Transaction> recentTransactions = transactionService.getTransactionsByDateRange(username, startDate, endDate);
        model.addAttribute("recentTransactions", recentTransactions);
        
        // Dodaj kategorie do modelu
        model.addAttribute("categories", Arrays.asList(Category.values()));
        
        return "dashboard";
    }

    @GetMapping("/budgets")
    public String budgets(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        if (userDetails == null) {
            return "redirect:/login";
        }
        
        String username = userDetails.getUsername();
        
        // Pobierz wszystkie budżety
        List<Budget> allBudgets = budgetService.getUserBudgets(username);
        model.addAttribute("budgets", allBudgets);
        
        // Dodaj kategorie do modelu
        model.addAttribute("categories", Arrays.asList(Category.values()));
        
        return "budgets";
    }

    @GetMapping("/transactions")
    public String transactions(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        if (userDetails == null) {
            return "redirect:/login";
        }
        
        String username = userDetails.getUsername();
        
        // Pobierz wszystkie transakcje
        List<Transaction> allTransactions = transactionService.getUserTransactions(username);
        model.addAttribute("transactions", allTransactions);
        
        // Dodaj kategorie do modelu
        model.addAttribute("categories", Arrays.asList(Category.values()));
        
        return "transactions";
    }

    @GetMapping("/profile")
    public String profile() {
        return "profile";
    }
} 
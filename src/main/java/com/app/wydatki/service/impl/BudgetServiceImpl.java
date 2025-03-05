package com.app.wydatki.service.impl;

import com.app.wydatki.dto.BudgetDTO;
import com.app.wydatki.model.Budget;
import com.app.wydatki.model.User;
import com.app.wydatki.repository.BudgetRepository;
import com.app.wydatki.repository.UserRepository;
import com.app.wydatki.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Budget createBudget(BudgetDTO budgetDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = new Budget();
        budget.setName(budgetDTO.getName());
        budget.setAmount(budgetDTO.getAmount());
        budget.setStartDate(budgetDTO.getStartDate());
        budget.setEndDate(budgetDTO.getEndDate());
        budget.setDescription(budgetDTO.getDescription());
        budget.setUser(user);
        budget.setSpentAmount(BigDecimal.ZERO);

        return budgetRepository.save(budget);
    }

    @Override
    @Transactional
    public Budget updateBudget(Long id, BudgetDTO budgetDTO, String userEmail) {
        Budget budget = getBudgetById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        budget.setName(budgetDTO.getName());
        budget.setAmount(budgetDTO.getAmount());
        budget.setStartDate(budgetDTO.getStartDate());
        budget.setEndDate(budgetDTO.getEndDate());
        budget.setDescription(budgetDTO.getDescription());

        return budgetRepository.save(budget);
    }

    @Override
    @Transactional
    public void deleteBudget(Long id, String userEmail) {
        Budget budget = getBudgetById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        budgetRepository.delete(budget);
    }

    @Override
    public Optional<Budget> getBudgetById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return budgetRepository.findByIdAndUserId(id, user.getId());
    }

    @Override
    public List<Budget> getUserBudgets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return budgetRepository.findByUserId(user.getId());
    }

    @Override
    public List<Budget> getActiveBudgets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return budgetRepository.findCurrentActiveBudgets(user.getId());
    }

    @Override
    public List<Budget> getUpcomingBudgets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return budgetRepository.findUpcomingBudgets(user.getId());
    }

    @Override
    public List<Budget> getPastBudgets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return budgetRepository.findPastBudgets(user.getId());
    }

    @Override
    public List<Budget> getBudgetsInDateRange(String userEmail, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return budgetRepository.findBudgetsInDateRange(user.getId(), startDate, endDate);
    }

    @Override
    public BigDecimal getTotalBudgetAmount(String userEmail, LocalDate startDate, LocalDate endDate) {
        List<Budget> budgets = getBudgetsInDateRange(userEmail, startDate, endDate);
        return budgets.stream()
                .map(Budget::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public BigDecimal getRemainingBudgetAmount(Long budgetId, String userEmail) {
        Budget budget = getBudgetById(budgetId, userEmail)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        return budget.getRemainingAmount();
    }

    @Override
    @Transactional
    public Budget addSpending(Long budgetId, BigDecimal amount, String userEmail) {
        Budget budget = getBudgetById(budgetId, userEmail)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.isActive()) {
            throw new RuntimeException("Budget is not active");
        }

        budget.setSpentAmount(budget.getSpentAmount().add(amount));
        return budgetRepository.save(budget);
    }

    @Override
    @Transactional
    public Budget removeSpending(Long budgetId, BigDecimal amount, String userEmail) {
        Budget budget = getBudgetById(budgetId, userEmail)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.isActive()) {
            throw new RuntimeException("Budget is not active");
        }

        budget.setSpentAmount(budget.getSpentAmount().subtract(amount));
        return budgetRepository.save(budget);
    }

    @Override
    public boolean isBudgetActive(Long budgetId, String userEmail) {
        Budget budget = getBudgetById(budgetId, userEmail)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        return budget.isActive();
    }

    @Override
    public List<Budget> getBudgetsByCategory(String userEmail, String category) {
        // TODO: Implement when category field is added to Budget entity
        throw new UnsupportedOperationException("Not implemented yet");
    }
} 
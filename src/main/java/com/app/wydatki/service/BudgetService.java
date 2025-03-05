package com.app.wydatki.service;

import com.app.wydatki.dto.BudgetDTO;
import com.app.wydatki.model.Budget;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BudgetService {
    
    Budget createBudget(BudgetDTO budgetDTO, String userEmail);
    
    Budget updateBudget(Long id, BudgetDTO budgetDTO, String userEmail);
    
    void deleteBudget(Long id, String userEmail);
    
    Optional<Budget> getBudgetById(Long id, String userEmail);
    
    List<Budget> getUserBudgets(String userEmail);
    
    List<Budget> getActiveBudgets(String userEmail);
    
    List<Budget> getUpcomingBudgets(String userEmail);
    
    List<Budget> getPastBudgets(String userEmail);
    
    List<Budget> getBudgetsInDateRange(String userEmail, LocalDate startDate, LocalDate endDate);
    
    BigDecimal getTotalBudgetAmount(String userEmail, LocalDate startDate, LocalDate endDate);
    
    BigDecimal getRemainingBudgetAmount(Long budgetId, String userEmail);
    
    Budget addSpending(Long budgetId, BigDecimal amount, String userEmail);
    
    Budget removeSpending(Long budgetId, BigDecimal amount, String userEmail);
    
    boolean isBudgetActive(Long budgetId, String userEmail);
    
    List<Budget> getBudgetsByCategory(String userEmail, String category);
}

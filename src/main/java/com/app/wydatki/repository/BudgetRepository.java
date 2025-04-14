package com.app.wydatki.repository;

import com.app.wydatki.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    List<Budget> findByUserId(Long userId);
    
    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.startDate <= :date AND b.endDate >= :date")
    List<Budget> findActiveBudgetsByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);
    
    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.startDate <= :endDate AND b.endDate >= :startDate")
    List<Budget> findBudgetsInDateRange(@Param("userId") Long userId, 
                                      @Param("startDate") LocalDate startDate, 
                                      @Param("endDate") LocalDate endDate);
    
    Optional<Budget> findByIdAndUserId(Long id, Long userId);
    
    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.startDate <= CURRENT_DATE AND b.endDate >= CURRENT_DATE")
    List<Budget> findCurrentActiveBudgets(@Param("userId") Long userId);
    
    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.startDate > CURRENT_DATE")
    List<Budget> findUpcomingBudgets(@Param("userId") Long userId);
    
    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.endDate < CURRENT_DATE")
    List<Budget> findPastBudgets(@Param("userId") Long userId);
}

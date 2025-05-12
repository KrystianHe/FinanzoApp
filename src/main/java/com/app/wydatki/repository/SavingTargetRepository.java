package com.app.wydatki.repository;

import com.app.wydatki.model.SavingTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavingTargetRepository extends JpaRepository<SavingTarget, Long> {
    
    List<SavingTarget> findByUserEmail(String email);
    
    Optional<SavingTarget> findByIdAndUserEmail(Long id, String email);
    
    List<SavingTarget> findByUserEmailAndIsCompletedTrue(String email);
    
    List<SavingTarget> findByUserEmailAndIsCompletedFalse(String email);
    
    List<SavingTarget> findByUserEmailAndTargetDateBefore(String email, LocalDate date);
    
    List<SavingTarget> findByUserEmailAndCategory(String email, String category);
} 
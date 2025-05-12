package com.app.wydatki.repository;

import com.app.wydatki.model.Saving;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavingRepository extends JpaRepository<Saving, Long> {
    List<Saving> findByUserEmail(String email);
    
    Optional<Saving> findByIdAndUserEmail(Long id, String email);
    
    List<Saving> findByUserEmailAndIsCompletedTrue(String email);
    
    List<Saving> findByUserEmailAndIsCompletedFalse(String email);
    
    List<Saving> findByUserEmailAndTargetDateBefore(String email, LocalDate date);
    
    List<Saving> findByUserEmailAndCategory(String email, String category);
} 
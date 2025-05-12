package com.app.wydatki.service;

import com.app.wydatki.dto.SavingTargetDTO;
import com.app.wydatki.model.SavingTarget;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface SavingTargetService {

    SavingTarget createSavingTarget(SavingTargetDTO savingTargetDTO, String userEmail);
    SavingTarget updateSavingTarget(Long id, SavingTargetDTO savingTargetDTO, String userEmail);
    boolean deleteSavingTarget(Long id, String userEmail);
    Optional<SavingTarget> getSavingTargetById(Long id, String userEmail);
    List<SavingTarget> getUserSavingTargets(String userEmail);
    List<SavingTarget> getCompletedSavingTargets(String userEmail);
    List<SavingTarget> getInProgressSavingTargets(String userEmail);
    SavingTarget addContribution(Long id, BigDecimal amount, String userEmail);
    SavingTarget withdrawAmount(Long id, BigDecimal amount, String userEmail);
    BigDecimal calculateProgressPercentage(Long id, String userEmail);
    int calculateDaysUntilTarget(Long id, String userEmail);
    List<SavingTarget> getSavingTargetsByCategory(String userEmail, String category);
    List<SavingTarget> getSavingTargetsWithUpcomingTargetDate(String userEmail, int daysThreshold);
} 
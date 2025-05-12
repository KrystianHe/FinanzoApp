package com.app.wydatki.service;

import com.app.wydatki.dto.SavingDTO;
import com.app.wydatki.model.Saving;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface SavingService {

    Saving createSaving(SavingDTO savingDTO, String userEmail);

    Saving updateSaving(Long id, SavingDTO savingDTO, String userEmail);

    boolean deleteSaving(Long id, String userEmail);

    Optional<Saving> getSavingById(Long id, String userEmail);

    List<Saving> getUserSavings(String userEmail);

    List<Saving> getCompletedSavings(String userEmail);

    List<Saving> getInProgressSavings(String userEmail);

    Saving addContribution(Long id, BigDecimal amount, String userEmail);

    Saving withdrawAmount(Long id, BigDecimal amount, String userEmail);

    BigDecimal calculateProgressPercentage(Long id, String userEmail);

    int calculateDaysUntilTarget(Long id, String userEmail);

    List<Saving> getSavingsByCategory(String userEmail, String category);

    List<Saving> getSavingsWithUpcomingTargetDate(String userEmail, int daysThreshold);
}

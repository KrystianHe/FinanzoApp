package com.app.wydatki.service;

import com.app.wydatki.dto.SavingDTO;
import com.app.wydatki.model.Saving;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface SavingService {

    /**
     * Creates a new saving goal for the user
     */
    Saving createSaving(SavingDTO savingDTO, String userEmail);

    /**
     * Updates an existing saving goal
     */
    Saving updateSaving(Long id, SavingDTO savingDTO, String userEmail);

    /**
     * Deletes a saving goal
     */
    boolean deleteSaving(Long id, String userEmail);

    /**
     * Gets a specific saving goal by id
     */
    Optional<Saving> getSavingById(Long id, String userEmail);

    /**
     * Gets all savings for a user
     */
    List<Saving> getUserSavings(String userEmail);

    /**
     * Gets all completed savings for a user
     */
    List<Saving> getCompletedSavings(String userEmail);

    /**
     * Gets all in-progress savings for a user
     */
    List<Saving> getInProgressSavings(String userEmail);

    /**
     * Adds a contribution to a saving goal
     */
    Saving addContribution(Long id, BigDecimal amount, String userEmail);

    /**
     * Withdraws an amount from a saving goal
     */
    Saving withdrawAmount(Long id, BigDecimal amount, String userEmail);

    /**
     * Calculates the progress percentage towards the target amount
     */
    BigDecimal calculateProgressPercentage(Long id, String userEmail);

    /**
     * Calculates the number of days until the target date
     */
    int calculateDaysUntilTarget(Long id, String userEmail);

    /**
     * Gets all savings for a user by category
     */
    List<Saving> getSavingsByCategory(String userEmail, String category);

    /**
     * Gets all savings with target dates within the specified days threshold
     */
    List<Saving> getSavingsWithUpcomingTargetDate(String userEmail, int daysThreshold);
}

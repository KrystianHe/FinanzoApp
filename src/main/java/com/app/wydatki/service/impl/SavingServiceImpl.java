package com.app.wydatki.service.impl;

import com.app.wydatki.dto.SavingDTO;
import com.app.wydatki.model.Saving;
import com.app.wydatki.model.User;
import com.app.wydatki.repository.SavingRepository;
import com.app.wydatki.repository.UserRepository;
import com.app.wydatki.service.SavingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SavingServiceImpl implements SavingService {

    private final SavingRepository savingRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Saving createSaving(SavingDTO savingDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        Saving saving = new Saving();
        saving.setName(savingDTO.getName());
        saving.setDescription(savingDTO.getDescription());
        saving.setTargetAmount(savingDTO.getTargetAmount());
        saving.setCurrentAmount(savingDTO.getCurrentAmount() != null ? savingDTO.getCurrentAmount() : BigDecimal.ZERO);
        saving.setStartDate(savingDTO.getStartDate());
        saving.setTargetDate(savingDTO.getTargetDate());
        saving.setCategory(savingDTO.getCategory());
        saving.setCompleted(false);
        saving.setUser(user);

        return savingRepository.save(saving);
    }

    @Override
    @Transactional
    public Saving updateSaving(Long id, SavingDTO savingDTO, String userEmail) {
        Saving saving = getSavingById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Cel oszczędnościowy nie istnieje lub nie masz do niego dostępu"));

        saving.setName(savingDTO.getName());
        saving.setDescription(savingDTO.getDescription());
        saving.setTargetAmount(savingDTO.getTargetAmount());
        saving.setStartDate(savingDTO.getStartDate());
        saving.setTargetDate(savingDTO.getTargetDate());
        saving.setCategory(savingDTO.getCategory());

        return savingRepository.save(saving);
    }

    @Override
    @Transactional
    public boolean deleteSaving(Long id, String userEmail) {
        Optional<Saving> savingOptional = getSavingById(id, userEmail);
        if (savingOptional.isPresent()) {
            savingRepository.delete(savingOptional.get());
            return true;
        }
        return false;
    }

    @Override
    public Optional<Saving> getSavingById(Long id, String userEmail) {
        return savingRepository.findByIdAndUserEmail(id, userEmail);
    }

    @Override
    public List<Saving> getUserSavings(String userEmail) {
        return savingRepository.findByUserEmail(userEmail);
    }

    @Override
    public List<Saving> getCompletedSavings(String userEmail) {
        return savingRepository.findByUserEmailAndIsCompletedTrue(userEmail);
    }

    @Override
    public List<Saving> getInProgressSavings(String userEmail) {
        return savingRepository.findByUserEmailAndIsCompletedFalse(userEmail);
    }

    @Override
    @Transactional
    public Saving addContribution(Long id, BigDecimal amount, String userEmail) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Kwota wpłaty musi być większa od zera");
        }

        Saving saving = getSavingById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Cel oszczędnościowy nie istnieje lub nie masz do niego dostępu"));

        saving.setCurrentAmount(saving.getCurrentAmount().add(amount));

        if (saving.getCurrentAmount().compareTo(saving.getTargetAmount()) >= 0 && !saving.isCompleted()) {
            saving.setCompleted(true);
            saving.setCompletionDate(LocalDate.now());
        }

        return savingRepository.save(saving);
    }

    @Override
    @Transactional
    public Saving withdrawAmount(Long id, BigDecimal amount, String userEmail) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Kwota wypłaty musi być większa od zera");
        }

        Saving saving = getSavingById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Cel oszczędnościowy nie istnieje lub nie masz do niego dostępu"));

        if (saving.getCurrentAmount().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Nie masz wystarczających środków na koncie oszczędnościowym");
        }

        saving.setCurrentAmount(saving.getCurrentAmount().subtract(amount));

        if (saving.isCompleted() && saving.getCurrentAmount().compareTo(saving.getTargetAmount()) < 0) {
            saving.setCompleted(false);
            saving.setCompletionDate(null);
        }

        return savingRepository.save(saving);
    }

    @Override
    public BigDecimal calculateProgressPercentage(Long id, String userEmail) {
        Saving saving = getSavingById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Cel oszczędnościowy nie istnieje lub nie masz do niego dostępu"));

        if (saving.getTargetAmount().compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.valueOf(100);
        }

        return saving.getCurrentAmount()
                .multiply(BigDecimal.valueOf(100))
                .divide(saving.getTargetAmount(), 2, RoundingMode.HALF_UP);
    }

    @Override
    public int calculateDaysUntilTarget(Long id, String userEmail) {
        Saving saving = getSavingById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Cel oszczędnościowy nie istnieje lub nie masz do niego dostępu"));

        if (saving.isCompleted() || saving.getTargetDate() == null) {
            return 0;
        }

        LocalDate now = LocalDate.now();
        if (now.isAfter(saving.getTargetDate())) {
            return 0;
        }

        return (int) ChronoUnit.DAYS.between(now, saving.getTargetDate());
    }

    @Override
    public List<Saving> getSavingsByCategory(String userEmail, String category) {
        return savingRepository.findByUserEmailAndCategory(userEmail, category);
    }

    @Override
    public List<Saving> getSavingsWithUpcomingTargetDate(String userEmail, int daysThreshold) {
        LocalDate thresholdDate = LocalDate.now().plusDays(daysThreshold);
        return savingRepository.findByUserEmailAndTargetDateBefore(userEmail, thresholdDate);
    }
} 
package com.app.wydatki.service.impl;

import com.app.wydatki.dto.SavingTargetDTO;
import com.app.wydatki.model.SavingTarget;
import com.app.wydatki.model.User;
import com.app.wydatki.repository.SavingTargetRepository;
import com.app.wydatki.repository.UserRepository;
import com.app.wydatki.service.SavingTargetService;
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
public class SavingTargetServiceImpl implements SavingTargetService {

    private final SavingTargetRepository savingTargetRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public SavingTarget createSavingTarget(SavingTargetDTO savingTargetDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        SavingTarget savingTarget = new SavingTarget();
        savingTarget.setName(savingTargetDTO.getName());
        savingTarget.setDescription(savingTargetDTO.getDescription());
        savingTarget.setTargetAmount(savingTargetDTO.getTargetAmount());
        savingTarget.setCurrentAmount(savingTargetDTO.getCurrentAmount() != null ? savingTargetDTO.getCurrentAmount() : BigDecimal.ZERO);
        savingTarget.setStartDate(savingTargetDTO.getStartDate());
        savingTarget.setTargetDate(savingTargetDTO.getTargetDate());
        savingTarget.setCategory(savingTargetDTO.getCategory());
        savingTarget.setCompleted(false);
        savingTarget.setUser(user);

        return savingTargetRepository.save(savingTarget);
    }

    @Override
    @Transactional
    public SavingTarget updateSavingTarget(Long id, SavingTargetDTO savingTargetDTO, String userEmail) {
        SavingTarget savingTarget = getSavingTargetById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Cel oszczędnościowy nie istnieje lub nie masz do niego dostępu"));

        savingTarget.setName(savingTargetDTO.getName());
        savingTarget.setDescription(savingTargetDTO.getDescription());
        savingTarget.setTargetAmount(savingTargetDTO.getTargetAmount());
        savingTarget.setStartDate(savingTargetDTO.getStartDate());
        savingTarget.setTargetDate(savingTargetDTO.getTargetDate());
        savingTarget.setCategory(savingTargetDTO.getCategory());

        return savingTargetRepository.save(savingTarget);
    }

    @Override
    @Transactional
    public boolean deleteSavingTarget(Long id, String userEmail) {
        Optional<SavingTarget> savingTargetOptional = getSavingTargetById(id, userEmail);
        if (savingTargetOptional.isPresent()) {
            savingTargetRepository.delete(savingTargetOptional.get());
            return true;
        }
        return false;
    }

    @Override
    public Optional<SavingTarget> getSavingTargetById(Long id, String userEmail) {
        return savingTargetRepository.findByIdAndUserEmail(id, userEmail);
    }

    @Override
    public List<SavingTarget> getUserSavingTargets(String userEmail) {
        return savingTargetRepository.findByUserEmail(userEmail);
    }

    @Override
    public List<SavingTarget> getCompletedSavingTargets(String userEmail) {
        return savingTargetRepository.findByUserEmailAndIsCompletedTrue(userEmail);
    }

    @Override
    public List<SavingTarget> getInProgressSavingTargets(String userEmail) {
        return savingTargetRepository.findByUserEmailAndIsCompletedFalse(userEmail);
    }

    @Override
    @Transactional
    public SavingTarget addContribution(Long id, BigDecimal amount, String userEmail) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Kwota wpłaty musi być większa od zera");
        }

        SavingTarget savingTarget = getSavingTargetById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Cel oszczędnościowy nie istnieje lub nie masz do niego dostępu"));

        savingTarget.setCurrentAmount(savingTarget.getCurrentAmount().add(amount));

        if (savingTarget.getCurrentAmount().compareTo(savingTarget.getTargetAmount()) >= 0 && !savingTarget.isCompleted()) {
            savingTarget.setCompleted(true);
            savingTarget.setCompletionDate(LocalDate.now());
        }

        return savingTargetRepository.save(savingTarget);
    }

    @Override
    @Transactional
    public SavingTarget withdrawAmount(Long id, BigDecimal amount, String userEmail) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Kwota wypłaty musi być większa od zera");
        }

        SavingTarget savingTarget = getSavingTargetById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Cel oszczędnościowy nie istnieje lub nie masz do niego dostępu"));

        if (savingTarget.getCurrentAmount().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Nie masz wystarczających środków na koncie oszczędnościowym");
        }

        savingTarget.setCurrentAmount(savingTarget.getCurrentAmount().subtract(amount));

        if (savingTarget.isCompleted() && savingTarget.getCurrentAmount().compareTo(savingTarget.getTargetAmount()) < 0) {
            savingTarget.setCompleted(false);
            savingTarget.setCompletionDate(null);
        }

        return savingTargetRepository.save(savingTarget);
    }

    @Override
    public BigDecimal calculateProgressPercentage(Long id, String userEmail) {
        SavingTarget savingTarget = getSavingTargetById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Cel oszczędnościowy nie istnieje lub nie masz do niego dostępu"));

        if (savingTarget.getTargetAmount().compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.valueOf(100);
        }

        return savingTarget.getCurrentAmount()
                .multiply(BigDecimal.valueOf(100))
                .divide(savingTarget.getTargetAmount(), 2, RoundingMode.HALF_UP);
    }

    @Override
    public int calculateDaysUntilTarget(Long id, String userEmail) {
        SavingTarget savingTarget = getSavingTargetById(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Cel oszczędnościowy nie istnieje lub nie masz do niego dostępu"));

        if (savingTarget.isCompleted() || savingTarget.getTargetDate() == null) {
            return 0;
        }

        LocalDate now = LocalDate.now();
        if (now.isAfter(savingTarget.getTargetDate())) {
            return 0;
        }

        return (int) ChronoUnit.DAYS.between(now, savingTarget.getTargetDate());
    }

    @Override
    public List<SavingTarget> getSavingTargetsByCategory(String userEmail, String category) {
        return savingTargetRepository.findByUserEmailAndCategory(userEmail, category);
    }

    @Override
    public List<SavingTarget> getSavingTargetsWithUpcomingTargetDate(String userEmail, int daysThreshold) {
        LocalDate thresholdDate = LocalDate.now().plusDays(daysThreshold);
        return savingTargetRepository.findByUserEmailAndTargetDateBefore(userEmail, thresholdDate);
    }
} 
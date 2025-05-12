package com.app.wydatki.controller;

import com.app.wydatki.dto.SavingTargetDTO;
import com.app.wydatki.model.SavingTarget;
import com.app.wydatki.service.SavingTargetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saving-targets")
@CrossOrigin
@RequiredArgsConstructor
public class SavingTargetController {

    private final SavingTargetService savingTargetService;

    @PostMapping
    public ResponseEntity<SavingTarget> createSavingTarget(
            @RequestBody @Valid SavingTargetDTO savingTargetDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingTargetService.createSavingTarget(savingTargetDTO, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<SavingTarget>> getUserSavingTargets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingTargetService.getUserSavingTargets(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavingTarget> getSavingTarget(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return savingTargetService.getSavingTargetById(id, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingTarget> updateSavingTarget(
            @PathVariable Long id,
            @RequestBody @Valid SavingTargetDTO savingTargetDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingTargetService.updateSavingTarget(id, savingTargetDTO, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSavingTarget(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean deleted = savingTargetService.deleteSavingTarget(id, userDetails.getUsername());
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/completed")
    public ResponseEntity<List<SavingTarget>> getCompletedSavingTargets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingTargetService.getCompletedSavingTargets(userDetails.getUsername()));
    }

    @GetMapping("/in-progress")
    public ResponseEntity<List<SavingTarget>> getInProgressSavingTargets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingTargetService.getInProgressSavingTargets(userDetails.getUsername()));
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<SavingTarget> addContribution(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingTargetService.addContribution(id, amount, userDetails.getUsername()));
    }

    @PostMapping("/{id}/withdraw")
    public ResponseEntity<SavingTarget> withdrawAmount(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingTargetService.withdrawAmount(id, amount, userDetails.getUsername()));
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<Map<String, Object>> getSavingTargetProgress(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        BigDecimal progressPercentage = savingTargetService.calculateProgressPercentage(id, userDetails.getUsername());
        int daysUntilTarget = savingTargetService.calculateDaysUntilTarget(id, userDetails.getUsername());
        
        return ResponseEntity.ok(Map.of(
                "progressPercentage", progressPercentage,
                "daysUntilTarget", daysUntilTarget
        ));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<SavingTarget>> getSavingTargetsByCategory(
            @PathVariable String category,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingTargetService.getSavingTargetsByCategory(userDetails.getUsername(), category));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<SavingTarget>> getUpcomingSavingTargets(
            @RequestParam(defaultValue = "30") int daysThreshold,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingTargetService.getSavingTargetsWithUpcomingTargetDate(userDetails.getUsername(), daysThreshold));
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getSavingStatistics(
            @AuthenticationPrincipal UserDetails userDetails) {
        int totalTargets = savingTargetService.getUserSavingTargets(userDetails.getUsername()).size();
        int completedTargets = savingTargetService.getCompletedSavingTargets(userDetails.getUsername()).size();
        int inProgressTargets = savingTargetService.getInProgressSavingTargets(userDetails.getUsername()).size();
        
        BigDecimal completionRate = BigDecimal.ZERO;
        if (totalTargets > 0) {
            completionRate = BigDecimal.valueOf(completedTargets * 100.0 / totalTargets)
                    .setScale(2, BigDecimal.ROUND_HALF_UP);
        }
        
        return ResponseEntity.ok(Map.of(
                "totalTargets", totalTargets,
                "completedTargets", completedTargets,
                "inProgressTargets", inProgressTargets,
                "completionRate", completionRate
        ));
    }
} 
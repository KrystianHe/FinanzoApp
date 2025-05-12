package com.app.wydatki.controller;

import com.app.wydatki.dto.SavingDTO;
import com.app.wydatki.model.Saving;
import com.app.wydatki.service.SavingService;
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
@RequestMapping("/api/savings")
@RequiredArgsConstructor
public class SavingController {

    private final SavingService savingService;

    @PostMapping
    public ResponseEntity<Saving> createSaving(
            @RequestBody @Valid SavingDTO savingDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingService.createSaving(savingDTO, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Saving>> getUserSavings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingService.getUserSavings(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Saving> getSaving(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return savingService.getSavingById(id, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Saving> updateSaving(
            @PathVariable Long id,
            @RequestBody @Valid SavingDTO savingDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingService.updateSaving(id, savingDTO, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSaving(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean deleted = savingService.deleteSaving(id, userDetails.getUsername());
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/completed")
    public ResponseEntity<List<Saving>> getCompletedSavings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingService.getCompletedSavings(userDetails.getUsername()));
    }

    @GetMapping("/in-progress")
    public ResponseEntity<List<Saving>> getInProgressSavings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingService.getInProgressSavings(userDetails.getUsername()));
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<Saving> addContribution(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingService.addContribution(id, amount, userDetails.getUsername()));
    }

    @PostMapping("/{id}/withdraw")
    public ResponseEntity<Saving> withdrawAmount(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingService.withdrawAmount(id, amount, userDetails.getUsername()));
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<Map<String, Object>> getSavingProgress(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        BigDecimal progressPercentage = savingService.calculateProgressPercentage(id, userDetails.getUsername());
        int daysUntilTarget = savingService.calculateDaysUntilTarget(id, userDetails.getUsername());
        
        return ResponseEntity.ok(Map.of(
                "progressPercentage", progressPercentage,
                "daysUntilTarget", daysUntilTarget
        ));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Saving>> getSavingsByCategory(
            @PathVariable String category,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingService.getSavingsByCategory(userDetails.getUsername(), category));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Saving>> getUpcomingSavings(
            @RequestParam(defaultValue = "30") int daysThreshold,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savingService.getSavingsWithUpcomingTargetDate(userDetails.getUsername(), daysThreshold));
    }
}

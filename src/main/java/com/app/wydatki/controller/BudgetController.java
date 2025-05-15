package com.app.wydatki.controller;

import com.app.wydatki.dto.BudgetDTO;
import com.app.wydatki.model.Budget;
import com.app.wydatki.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<Budget> createBudget(
            @RequestBody @Valid BudgetDTO budgetDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.createBudget(budgetDTO, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getUserBudgets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.getUserBudgets(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudget(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return budgetService.getBudgetById(id, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long id,
            @RequestBody @Valid BudgetDTO budgetDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.updateBudget(id, budgetDTO, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        budgetService.deleteBudget(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/active")
    public ResponseEntity<List<Budget>> getActiveBudgets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.getActiveBudgets(userDetails.getUsername()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Budget>> getUpcomingBudgets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.getUpcomingBudgets(userDetails.getUsername()));
    }

    @GetMapping("/past")
    public ResponseEntity<List<Budget>> getPastBudgets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.getPastBudgets(userDetails.getUsername()));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Budget>> getBudgetsInDateRange(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(budgetService.getBudgetsInDateRange(userDetails.getUsername(), startDate, endDate));
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalBudgetAmount(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(budgetService.getTotalBudgetAmount(userDetails.getUsername(), startDate, endDate));
    }

    @GetMapping("/{id}/remaining")
    public ResponseEntity<BigDecimal> getRemainingBudgetAmount(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.getRemainingBudgetAmount(id, userDetails.getUsername()));
    }

    @PostMapping("/{id}/add-spending")
    public ResponseEntity<Budget> addSpending(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.addSpending(id, amount, userDetails.getUsername()));
    }

    @PostMapping("/{id}/remove-spending")
    public ResponseEntity<Budget> removeSpending(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.removeSpending(id, amount, userDetails.getUsername()));
    }

    @GetMapping("/{id}/is-active")
    public ResponseEntity<Boolean> isBudgetActive(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.isBudgetActive(id, userDetails.getUsername()));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Budget>> getBudgetsByCategory(
            @PathVariable String category,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.getBudgetsByCategory(userDetails.getUsername(), category));
    }
}

package com.app.wydatki.controller;

import com.app.wydatki.dto.TransactionDTO;
import com.app.wydatki.dto.fiilter.TransactionFilterDTO;
import com.app.wydatki.model.Transaction;
import com.app.wydatki.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.data.domain.Page;
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
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(
            @RequestBody @Valid TransactionDTO transactionDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(transactionService.addTransaction(transactionDTO, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody @Valid TransactionDTO transactionDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(transactionService.updateTransaction(id, transactionDTO, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean deleted = transactionService.deleteTransaction(id, userDetails.getUsername());
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return transactionService.getTransactionById(id, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getUserTransactions(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(transactionService.getUserTransactions(userDetails.getUsername()));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Transaction>> getTransactionsByDateRange(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.getTransactionsByDateRange(
                userDetails.getUsername(), startDate, endDate));
    }

    @GetMapping("/summary")
    public ResponseEntity<BigDecimal> getTransactionSummary(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.getTransactionSummary(
                userDetails.getUsername(), startDate, endDate));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, BigDecimal>> getTransactionStats(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.getTransactionStats(
                userDetails.getUsername(), startDate, endDate));
    }

    @GetMapping("/by-date")
    public ResponseEntity<List<Transaction>> getTransactionsByDate(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(transactionService.getTransactionsByDate(
                userDetails.getUsername(), date));
    }

    @GetMapping("/summary-by-day")
    public ResponseEntity<BigDecimal> getTransactionSummaryByDay(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(transactionService.getTransactionSummaryByDay(
                userDetails.getUsername(), date));
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<Map<Integer, BigDecimal>> getMonthlyTransactionSummary(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.getMonthlyTransactionSummary(
                userDetails.getUsername(), startDate, endDate));
    }

    @GetMapping("/exclude-category")
    public ResponseEntity<List<Transaction>> getTransactionsExcludingCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam String excludedCategory) {
        return ResponseEntity.ok(transactionService.getTransactionsExcludingCategory(
                userDetails.getUsername(), startDate, endDate, excludedCategory));
    }

    @PostMapping("/filter")
    public ResponseEntity<List<Transaction>> filterTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody TransactionFilterDTO filterDTO) {
        return ResponseEntity.ok(transactionService.filterTransactions(
                userDetails.getUsername(), filterDTO));
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Transaction>> getPaginatedTransactions(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection) {
        
        TransactionFilterDTO filterDTO = new TransactionFilterDTO();
        filterDTO.setPage(page != null ? page : 0);
        filterDTO.setSize(size != null ? size : 10);
        filterDTO.setSearchTerm(search);
        filterDTO.setCategory(category);
        filterDTO.setType(type);
        filterDTO.setStartDate(dateFrom);
        filterDTO.setEndDate(dateTo);
        filterDTO.setSortBy(sortBy);
        filterDTO.setSortDirection(sortDirection);
        
        Page<Transaction> transactions = transactionService.getPaginatedTransactions(
                userDetails.getUsername(), filterDTO);
                
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportTransactions(
            @AuthenticationPrincipal UserDetails userDetails) {
        byte[] csvData = transactionService.exportTransactionsToCSV(userDetails.getUsername());
        
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=transactions.csv")
                .header("Content-Type", "text/csv")
                .body(csvData);
    }
}

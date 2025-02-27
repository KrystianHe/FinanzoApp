package com.app.wydatki.controller;

import com.app.wydatki.dto.TransactionDTO;
import com.app.wydatki.dto.fiilter.TransactionFilterDTO;
import com.app.wydatki.model.Transaction;
import com.app.wydatki.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Dodanie transakcji
    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestBody TransactionDTO transactionDTO, @RequestHeader("userEmail") String userEmail) {
        Transaction transaction = transactionService.addTransaction(transactionDTO, userEmail);
        return ResponseEntity.ok(transaction);
    }

    // Aktualizacja transakcji
    @PutMapping("/{transactionId}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long transactionId, @RequestBody TransactionDTO transactionDTO, @RequestHeader("userEmail") String userEmail) {
        Transaction updatedTransaction = transactionService.updateTransaction(transactionId, transactionDTO, userEmail);
        return ResponseEntity.ok(updatedTransaction);
    }

    // Usunięcie transakcji
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Boolean> deleteTransaction(@PathVariable Long transactionId, @RequestHeader("userEmail") String userEmail) {
        boolean isDeleted = transactionService.deleteTransaction(transactionId, userEmail);
        return ResponseEntity.ok(isDeleted);
    }

    // Pobranie transakcji po ID
    @GetMapping("/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long transactionId, @RequestHeader("userEmail") String userEmail) {
        Optional<Transaction> transaction = transactionService.getTransactionById(transactionId, userEmail);
        return transaction.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Pobranie transakcji użytkownika
    @GetMapping
    public ResponseEntity<List<Transaction>> getUserTransactions(@RequestHeader("userEmail") String userEmail) {
        List<Transaction> transactions = transactionService.getUserTransactions(userEmail);
        return ResponseEntity.ok(transactions);
    }

    // Filtrowanie transakcji na podstawie TransactionFilterDTO
    @PostMapping("/filter")
    public ResponseEntity<List<Transaction>> filterTransactions(@RequestHeader("userEmail") String userEmail, @RequestBody TransactionFilterDTO filterDTO) {
        List<Transaction> filteredTransactions = transactionService.filterTransactions(userEmail, filterDTO);
        return ResponseEntity.ok(filteredTransactions);
    }

    // Pobranie podsumowania transakcji w okresie
    @GetMapping("/summary")
    public ResponseEntity<BigDecimal> getTransactionSummary(@RequestHeader("userEmail") String userEmail, @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        BigDecimal summary = transactionService.getTransactionSummary(userEmail, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    // Pobranie statystyk transakcji w okresie
    @GetMapping("/stats")
    public ResponseEntity<Map<String, BigDecimal>> getTransactionStats(@RequestHeader("userEmail") String userEmail, @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        Map<String, BigDecimal> stats = transactionService.getTransactionStats(userEmail, startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    // Pobranie transakcji według daty
    @GetMapping("/date")
    public ResponseEntity<List<Transaction>> getTransactionsByDate(@RequestHeader("userEmail") String userEmail, @RequestParam LocalDate date) {
        List<Transaction> transactions = transactionService.getTransactionsByDate(userEmail, date);
        return ResponseEntity.ok(transactions);
    }

    // Pobranie podsumowania transakcji na dany dzień
    @GetMapping("/summary/day")
    public ResponseEntity<BigDecimal> getTransactionSummaryByDay(@RequestHeader("userEmail") String userEmail, @RequestParam LocalDate date) {
        BigDecimal summary = transactionService.getTransactionSummaryByDay(userEmail, date);
        return ResponseEntity.ok(summary);
    }

    // Pobranie miesięcznego podsumowania transakcji
    @GetMapping("/monthly/summary")
    public ResponseEntity<Map<Integer, BigDecimal>> getMonthlyTransactionSummary(@RequestHeader("userEmail") String userEmail, @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        Map<Integer, BigDecimal> monthlySummary = transactionService.getMonthlyTransactionSummary(userEmail, startDate, endDate);
        return ResponseEntity.ok(monthlySummary);
    }

    // Pobranie transakcji z wykluczoną kategorią
    @GetMapping("/exclude-category")
    public ResponseEntity<List<Transaction>> getTransactionsExcludingCategory(@RequestHeader("userEmail") String userEmail, @RequestParam LocalDate startDate, @RequestParam LocalDate endDate, @RequestParam String excludedCategory) {
        List<Transaction> transactions = transactionService.getTransactionsExcludingCategory(userEmail, startDate, endDate, excludedCategory);
        return ResponseEntity.ok(transactions);
    }
}

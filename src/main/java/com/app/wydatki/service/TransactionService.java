package com.app.wydatki.service;

import com.app.wydatki.dto.TransactionDTO;
import com.app.wydatki.dto.fiilter.TransactionFilterDTO;
import com.app.wydatki.model.Transaction;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface TransactionService {

    Transaction addTransaction(TransactionDTO transactionDTO, String userEmail);

    Transaction updateTransaction(Long transactionId, TransactionDTO transactionDTO, String userEmail);

    boolean deleteTransaction(Long transactionId, String userEmail);

    Optional<Transaction> getTransactionById(Long transactionId, String userEmail);

    List<Transaction> getUserTransactions(String userEmail);

    List<Transaction> getTransactionsByDateRange(String userEmail, LocalDate startDate, LocalDate endDate);

    BigDecimal getTransactionSummary(String userEmail, LocalDate startDate, LocalDate endDate);

    Map<String, BigDecimal> getTransactionStats(String userEmail, LocalDate startDate, LocalDate endDate);

    List<Transaction> getTransactionsByDate(String userEmail, LocalDate date);

    BigDecimal getTransactionSummaryByDay(String userEmail, LocalDate date);

    Map<Integer, BigDecimal> getMonthlyTransactionSummary(String userEmail, LocalDate startDate, LocalDate endDate);

    List<Transaction> getTransactionsExcludingCategory(String userEmail, LocalDate startDate, LocalDate endDate, String excludedCategory);

    List<Transaction> filterTransactions(String userEmail, TransactionFilterDTO filterDTO);
    
    /**
     * Pobiera paginowaną listę transakcji na podstawie filtrów
     * 
     * @param userEmail email użytkownika
     * @param filterDTO obiekt zawierający filtry, sortowanie i parametry paginacji
     * @return obiekt Page zawierający wyniki oraz metadane paginacji
     */
    Page<Transaction> getPaginatedTransactions(String userEmail, TransactionFilterDTO filterDTO);
    
    /**
     * Eksportuje wszystkie transakcje użytkownika do formatu CSV
     * 
     * @param userEmail email użytkownika
     * @return tablica bajtów zawierająca dane CSV
     */
    byte[] exportTransactionsToCSV(String userEmail);
}

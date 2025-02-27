package com.app.wydatki.impl;

import com.app.wydatki.dto.TransactionDTO;
import com.app.wydatki.dto.fiilter.TransactionFilterDTO;
import com.app.wydatki.model.Transaction;
import com.app.wydatki.repository.TransactionRepository;
import com.app.wydatki.repository.UserRepository;
import com.app.wydatki.service.TransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public Transaction addTransaction(TransactionDTO transactionDTO, String userEmail) {
        var user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Użytkownik nie znaleziony"));

        Transaction transaction = new Transaction();
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setCategory(transactionDTO.getCategory());
        transaction.setDate(transactionDTO.getDate());
        transaction.setDescription(transactionDTO.getDescription());
        transaction.setUser(user);

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction updateTransaction(Long transactionId, TransactionDTO transactionDTO, String userEmail) {
        Transaction transaction = transactionRepository.findByIdAndUserEmail(transactionId, userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Transakcja nie znaleziona"));

        transaction.setAmount(transactionDTO.getAmount());
        transaction.setCategory(transactionDTO.getCategory());
        transaction.setDate(transactionDTO.getDate());
        transaction.setDescription(transactionDTO.getDescription());

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public boolean deleteTransaction(Long transactionId, String userEmail) {
        Transaction transaction = transactionRepository.findByIdAndUserEmail(transactionId, userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Transakcja nie znaleziona"));
        transactionRepository.delete(transaction);
        return true;
    }

    @Override
    public Optional<Transaction> getTransactionById(Long transactionId, String userEmail) {
        return transactionRepository.findByIdAndUserEmail(transactionId, userEmail);
    }

    @Override
    public List<Transaction> getUserTransactions(String userEmail) {
        return transactionRepository.findByUserEmail(userEmail);
    }

    @Override
    public List<Transaction> getTransactionsByDateRange(String userEmail, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserEmailAndDateBetween(userEmail, startDate, endDate);
    }

    @Override
    public BigDecimal getTransactionSummary(String userEmail, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.sumTransactions(userEmail, startDate, endDate);
    }

    @Override
    public Map<String, BigDecimal> getTransactionStats(String userEmail, LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository.findByUserEmailAndDateBetween(userEmail, startDate, endDate);
        return transactions.stream()
                .collect(Collectors.groupingBy(Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)));
    }

    @Override
    public List<Transaction> getTransactionsByDate(String userEmail, LocalDate date) {
        return transactionRepository.findByUserEmailAndDateBetween(userEmail, date, date);
    }

    @Override
    public BigDecimal getTransactionSummaryByDay(String userEmail, LocalDate date) {
        return transactionRepository.sumTransactions(userEmail, date, date);
    }

    @Override
    public Map<Integer, BigDecimal> getMonthlyTransactionSummary(String userEmail, LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository.findByUserEmailAndDateBetweenOrderByDateDesc(userEmail, startDate, endDate);
        return transactions.stream()
                .collect(Collectors.groupingBy(
                        transaction -> transaction.getDate().getMonthValue(),
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));
    }

    @Override
    public List<Transaction> getTransactionsExcludingCategory(String userEmail, LocalDate startDate, LocalDate endDate, String excludedCategory) {
        return transactionRepository.findFilteredTransactions(userEmail, startDate, endDate, excludedCategory, BigDecimal.ZERO, BigDecimal.ZERO);
    }


    @Override
    public List<Transaction> filterTransactions(String userEmail, TransactionFilterDTO filterDTO) {
        return transactionRepository.findFilteredTransactionsByDTO(userEmail, filterDTO);
    }
}

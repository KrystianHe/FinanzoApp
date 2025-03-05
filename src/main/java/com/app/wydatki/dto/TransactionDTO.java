package com.app.wydatki.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {

    private Long id;

    @NotBlank(message = "Nazwa transakcji jest wymagana")
    private String name;

    @NotNull(message = "Kwota transakcji jest wymagana")
    @Positive(message = "Kwota transakcji musi być większa od zera")
    private BigDecimal amount;

    @NotNull(message = "Data transakcji jest wymagana")
    private LocalDate date;

    private String category;

    private String description;

    private Long budgetId;

    private String type; // INCOME, EXPENSE
}

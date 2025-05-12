package com.app.wydatki.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavingTargetDTO {

    private Long id;

    @NotBlank(message = "Nazwa celu oszczędnościowego jest wymagana")
    private String name;

    private String description;

    @NotNull(message = "Kwota docelowa jest wymagana")
    @DecimalMin(value = "0.01", message = "Kwota docelowa musi być większa od zera")
    private BigDecimal targetAmount;

    private BigDecimal currentAmount;

    @NotNull(message = "Data rozpoczęcia jest wymagana")
    private LocalDate startDate;

    private LocalDate targetDate;

    private String category;

    private boolean isCompleted;
} 
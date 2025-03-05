package com.app.wydatki.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class BudgetDTO {
    
    private Long id;
    
    @NotBlank(message = "Nazwa budżetu nie może być pusta")
    private String name;
    
    @NotNull(message = "Kwota budżetu nie może być pusta")
    @Positive(message = "Kwota budżetu musi być większa od zera")
    private BigDecimal amount;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private String category;
    
    private String description;
    
    private BigDecimal remainingAmount;
    
    private String status;
} 
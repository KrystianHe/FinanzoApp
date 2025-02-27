package com.app.wydatki.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionDTO {

    private BigDecimal amount;
    private String category;
    private LocalDate date;
    private String description;
}

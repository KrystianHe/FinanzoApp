package com.app.wydatki.dto.fiilter;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionFilterDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private String category;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
}

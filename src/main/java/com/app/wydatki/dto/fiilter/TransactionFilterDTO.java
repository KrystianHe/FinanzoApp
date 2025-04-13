package com.app.wydatki.dto.fiilter;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionFilterDTO {

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private List<String> categories;
    private String category;
    private String type; // INCOME, EXPENSE
    private String searchTerm;
    private String sortBy;
    private String sortDirection;
    private Integer page;
    private Integer size;
}

package com.app.wydatki.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "budgets")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column(nullable = false)
    private LocalDate endDate;
    
    @Column
    private String description;
    
    @Column(nullable = false)
    @Builder.Default
    private BigDecimal spentAmount = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private String category;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    public BigDecimal getRemainingAmount() {
        return amount.subtract(spentAmount);
    }
    
    public boolean isActive() {
        LocalDate now = LocalDate.now();
        return !now.isBefore(startDate) && !now.isAfter(endDate);
    }
}

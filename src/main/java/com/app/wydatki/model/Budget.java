package com.app.wydatki.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data

public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;


}

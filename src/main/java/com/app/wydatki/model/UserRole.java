package com.app.wydatki.model;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity(name = "UserRole")
@Table(name = "user_role")

public class UserRole implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;
}

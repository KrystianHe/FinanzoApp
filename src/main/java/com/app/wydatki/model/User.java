package com.app.wydatki.model;

import com.app.wydatki.enums.UserState;
import com.app.wydatki.enums.UserType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Map;

@Entity(name = "User")
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Nazwa nie może być pusta.")
    @Basic
    @Column(name = "login", nullable = false, length = 100)
    private String name;

    @Basic
    @Column(name = "lastname", nullable = false, length = 100)
    private String lastname;

    @Basic
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Basic
    @Column(name = "date_of_birth", nullable = false)
    private LocalDateTime dateOfBirth;

    @Basic
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Basic
    @Column(name = "modify_at")
    private LocalDateTime modifyAt;

    @Basic
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Basic
    @Column(name="last_change_password")
    private LocalDateTime lastChangePassword;

    @Basic
    @Column(name ="status", nullable = false, length = 15)
    private UserState status;

    @Basic
    @Column(name="type", nullable = false, length = 15)
    private UserType type;

    @Basic
    @Column(name="verification_code")
    private String verificationCode;

    @Basic
    @Column(name="verification_code_expiration")
    private LocalDateTime verificationCodeExpiration;

    @Basic
    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column
    private String resetPasswordToken;

    @Column
    private LocalDateTime resetPasswordTokenExpiry;

    @ElementCollection
    @CollectionTable(name = "user_preferences")
    @MapKeyColumn(name = "preference_key")
    @Column(name = "preference_value")
    private Map<String, String> preferences;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

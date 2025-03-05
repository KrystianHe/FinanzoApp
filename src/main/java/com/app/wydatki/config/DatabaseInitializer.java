package com.app.wydatki.config;

import com.app.wydatki.enums.UserState;
import com.app.wydatki.enums.UserType;
import com.app.wydatki.model.User;
import com.app.wydatki.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashMap;

@Configuration
@RequiredArgsConstructor
@Profile("!test")
public class DatabaseInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            // Sprawdź czy baza danych jest pusta
            if (userRepository.count() == 0) {
                // Utwórz przykładowego administratora
                User admin = User.builder()
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("admin123"))
                        .name("Admin")
                        .lastname("System")
                        .status(UserState.ACTIVE)
                        .type(UserType.ADMIN)
                        .dateOfBirth(LocalDateTime.now().minusYears(30))
                        .verificationCode(null)
                        .verificationCodeExpiration(null)
                        .resetPasswordToken(null)
                        .resetPasswordTokenExpiry(null)
                        .createdAt(LocalDateTime.now())
                        .modifyAt(LocalDateTime.now())
                        .lastChangePassword(LocalDateTime.now())
                        .failedLoginAttempts(0)
                        .preferences(new HashMap<>())
                        .build();
                
                userRepository.save(admin);
                
                // Utwórz przykładowego użytkownika
                User user = User.builder()
                        .email("user@example.com")
                        .password(passwordEncoder.encode("user123"))
                        .name("Jan")
                        .lastname("Kowalski")
                        .status(UserState.ACTIVE)
                        .type(UserType.USER)
                        .dateOfBirth(LocalDateTime.now().minusYears(25))
                        .verificationCode(null)
                        .verificationCodeExpiration(null)
                        .resetPasswordToken(null)
                        .resetPasswordTokenExpiry(null)
                        .createdAt(LocalDateTime.now())
                        .modifyAt(LocalDateTime.now())
                        .lastChangePassword(LocalDateTime.now())
                        .failedLoginAttempts(0)
                        .preferences(new HashMap<>())
                        .build();
                
                userRepository.save(user);
                
                System.out.println("Baza danych została zainicjalizowana przykładowymi danymi.");
            }
        };
    }
} 
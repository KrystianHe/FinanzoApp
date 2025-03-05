package com.app.wydatki.repository;

import com.app.wydatki.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    Optional<User> getUserByLogin(String email);
    Optional<User> findByEmailAndVerificationCode(String email, String verificationCode);

    Optional<User> findByResetPasswordToken(String resetPasswordToken);
}

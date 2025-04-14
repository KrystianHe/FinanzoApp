package com.app.wydatki.repository;

import com.app.wydatki.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);
    
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findById(@Param("id") Long id);
    
    @Query("SELECT u FROM User u WHERE u.verificationToken = :token")
    Optional<User> findByVerificationToken(@Param("token") String token);
    
    @Query("SELECT u FROM User u WHERE u.resetPasswordToken = :token")
    Optional<User> findByResetPasswordToken(@Param("token") String token);
    
    boolean existsByEmail(String email);

    Optional<User> getUserByEmail(String email);
    Optional<User> findByEmailAndVerificationCode(String email, String verificationCode);
}

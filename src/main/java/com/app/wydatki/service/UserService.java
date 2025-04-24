package com.app.wydatki.service;

import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.dto.VerificationRequestDTO;
import com.app.wydatki.enums.UserState;
import com.app.wydatki.model.User;
import org.keycloak.common.VerificationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserService {
    User registerUser(UserDTO userDTO);
    Optional<User> findByEmail(String email);

    boolean activateUserAccount(VerificationRequestDTO verificationRequest) throws VerificationException;

    UserState updateUserStatus(String email, UserState userState);

    List<User> getAllUsers();

    void updateUserStatus(String email, String status);

    User updateUser(String email, UserDTO userDTO);

    void changePassword(String email, String currentPassword, String newPassword);

    void sendPasswordResetEmail(String email);

    void resetPassword(String token, String newPassword);

    void deleteUser(String email);

    Map<String, String> getUserPreferences(String email);

    @Transactional
    Map<String, String> updateUserPreferences(String email, Map<String, String> preferences);

    void resendVerificationCode(String email) throws VerificationException;

    // Metody dla dwuetapowej weryfikacji
    void saveVerificationCode(String email, String code);
    boolean verifyCode(String email, String code);
    void clearVerificationCode(String email);

    void verifyUser(String token);

    // Method to save a user entity
    User saveUser(User user);
    
    // Method to generate a verification code
    String generateVerificationCode();

    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;
}

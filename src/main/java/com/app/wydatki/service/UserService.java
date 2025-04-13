package com.app.wydatki.service;

import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.enums.UserState;
import com.app.wydatki.model.User;
import com.app.wydatki.request.UserActivateAccount;
import org.keycloak.common.VerificationException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserService {
    User registerUser(UserDTO userDTO);
    Optional<User> findByEmail(String email);

    boolean activateUserAccount(UserActivateAccount userActivateAccount) throws VerificationException;

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
}

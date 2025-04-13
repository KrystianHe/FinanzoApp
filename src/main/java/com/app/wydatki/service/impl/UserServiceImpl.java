package com.app.wydatki.service.impl;

import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.enums.UserState;
import com.app.wydatki.exceptions.UserAlreadyExistsException;
import com.app.wydatki.model.User;
import com.app.wydatki.repository.UserRepository;
import com.app.wydatki.request.UserActivateAccount;
import com.app.wydatki.service.SendEmailService;
import com.app.wydatki.service.UserService;
import lombok.RequiredArgsConstructor;
import org.keycloak.common.VerificationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SendEmailService sendEmailService;

    @Override
    @Transactional
    public User registerUser(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Użytkownik o podanym emailu już istnieje.");
        }

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setName(userDTO.getFirstName());
        user.setLastname(userDTO.getLastName());
        user.setStatus(UserState.INACTIVE);
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiration(LocalDateTime.now().plusHours(24));
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        
        sendEmailService.sendVerificationCode(savedUser.getEmail(), savedUser.getVerificationCode());
        
        return savedUser;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public UserState updateUserStatus(String email, UserState userState) {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        user.setStatus(userState);
        userRepository.save(user);
        return userState;
    }

    @Override
    @Transactional
    public void updateUserStatus(String email, String status) {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        user.setStatus(UserState.valueOf(status));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public boolean activateUserAccount(UserActivateAccount request) {
        User user = findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));

        if (!user.getVerificationCode().equals(request.getVerificationCode())) {
            throw new RuntimeException("Nieprawidłowy kod weryfikacyjny");
        }

        if (user.getVerificationCodeExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Kod weryfikacyjny wygasł");
        }

        user.setStatus(UserState.ACTIVE);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiration(null);
        userRepository.save(user);

        return true;
    }

    @Override
    @Transactional
    public User updateUser(String email, UserDTO userDTO) {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));

        user.setName(userDTO.getFirstName());
        user.setLastname(userDTO.getLastName());
        
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Nieprawidłowe obecne hasło");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void sendPasswordResetEmail(String email) {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));

        String resetToken = generateResetToken();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        sendEmailService.sendEmail(email, "Resetowanie hasła", "Aby zresetować hasło, kliknij w poniższy link:\n" +
                       "http://localhost:8080/reset-password?token=" + resetToken + "\n" +
                       "Link jest ważny przez 24 godziny.");
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new RuntimeException("Nieprawidłowy token resetowania hasła"));

        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token resetowania hasła wygasł");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(String email) {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        userRepository.delete(user);
    }

    @Override
    public Map<String, String> getUserPreferences(String email) {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        return user.getPreferences();
    }

    @Override
    @Transactional
    public Map<String, String> updateUserPreferences(String email, Map<String, String> preferences) {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        user.setPreferences(preferences);
        userRepository.save(user);
        return user.getPreferences();
    }

    @Override
    @Transactional
    public void resendVerificationCode(String email) throws VerificationException {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));

        if (user.getStatus() == UserState.ACTIVE) {
            throw new RuntimeException("Konto jest już aktywne");
        }

        String newVerificationCode = generateVerificationCode();
        user.setVerificationCode(newVerificationCode);
        user.setVerificationCodeExpiration(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        sendEmailService.sendVerificationCode(user.getEmail(), newVerificationCode);
    }

    @Override
    @Transactional
    public void saveVerificationCode(String email, String code) {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        
        user.setVerificationCode(code);
        user.setVerificationCodeExpiration(LocalDateTime.now().plusMinutes(10)); // Kod ważny przez 10 minut
        userRepository.save(user);
    }
    
    @Override
    public boolean verifyCode(String email, String code) {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        
        if (user.getVerificationCode() == null || user.getVerificationCodeExpiration() == null) {
            return false;
        }
        
        if (user.getVerificationCodeExpiration().isBefore(LocalDateTime.now())) {
            return false; // Kod wygasł
        }
        
        return user.getVerificationCode().equals(code);
    }
    
    @Override
    @Transactional
    public void clearVerificationCode(String email) {
        User user = findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));
        
        user.setVerificationCode(null);
        user.setVerificationCodeExpiration(null);
        userRepository.save(user);
    }

    private String generateVerificationCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }
} 
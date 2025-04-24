package com.app.wydatki.service.impl;

import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.dto.VerificationRequestDTO;
import com.app.wydatki.enums.UserState;
import com.app.wydatki.enums.UserType;
import com.app.wydatki.model.User;
import com.app.wydatki.model.UserRole;
import com.app.wydatki.repository.UserRepository;
import com.app.wydatki.repository.UserRoleRepository;
import com.app.wydatki.service.email.EmailService;
import com.app.wydatki.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.common.VerificationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    @Transactional
    public User registerUser(UserDTO userDTO) {
        log.info("Attempting to register user with email: {}", userDTO.getEmail());
        log.debug("Registration data: {}", userDTO);

        // Validate required fields
        if (userDTO.getFirstName() == null || userDTO.getFirstName().trim().isEmpty()) {
            log.error("First name is required");
            throw new IllegalArgumentException("First name is required");
        }
        if (userDTO.getLastName() == null || userDTO.getLastName().trim().isEmpty()) {
            log.error("Last name is required");
            throw new IllegalArgumentException("Last name is required");
        }
        if (userDTO.getEmail() == null || userDTO.getEmail().trim().isEmpty()) {
            log.error("Email is required");
            throw new IllegalArgumentException("Email is required");
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
            log.error("Password is required");
            throw new IllegalArgumentException("Password is required");
        }
        if (userDTO.getDateOfBirth() == null || userDTO.getDateOfBirth().trim().isEmpty()) {
            log.error("Date of birth is required");
            throw new IllegalArgumentException("Date of birth is required");
        }

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            log.warn("Registration failed - email already exists: {}", userDTO.getEmail());
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setFirstName(userDTO.getFirstName().trim());
        user.setLastName(userDTO.getLastName().trim());
        user.setEmail(userDTO.getEmail().trim());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate dateOfBirth = LocalDate.parse(userDTO.getDateOfBirth(), formatter);
        user.setDateOfBirth(dateOfBirth);
        
        user.setCreatedAt(LocalDateTime.now());
        user.setStatus(UserState.INACTIVE);
        user.setType(UserType.USER);
        user.setFailedLoginAttempts(0);
        user.setEnabled(false);
        
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiration(LocalDateTime.now().plusHours(24));

        User savedUser = userRepository.save(user);
        log.info("User saved with ID: {}", savedUser.getId());

        UserRole userRole = new UserRole();
        userRole.setRole("ROLE_USER");
        userRole.setUser(savedUser);
        userRoleRepository.save(userRole);
        log.info("User role created for user ID: {}", savedUser.getId());
        
        emailService.sendVerificationEmail(savedUser.getEmail(), verificationCode);
        log.info("Verification email sent to: {}", savedUser.getEmail());

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
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(userState);
        userRepository.save(user);
        return userState;
    }

    @Override
    @Transactional
    public void updateUserStatus(String email, String status) {
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserState.valueOf(status));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public boolean activateUserAccount(VerificationRequestDTO request) {
        User user = findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getVerificationCode().equals(request.getCode())) {
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
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Nieprawidłowe obecne hasło");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void sendPasswordResetEmail(String email) {
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        String resetToken = generateResetToken();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(email, resetToken);
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
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    @Override
    public Map<String, String> getUserPreferences(String email) {
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getPreferences();
    }

    @Override
    @Transactional
    public Map<String, String> updateUserPreferences(String email, Map<String, String> preferences) {
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPreferences(preferences);
        userRepository.save(user);
        return user.getPreferences();
    }

    @Override
    @Transactional
    public void resendVerificationCode(String email) throws VerificationException {
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == UserState.ACTIVE) {
            throw new RuntimeException("Konto jest już aktywne");
        }

        String newVerificationCode = generateVerificationCode();
        user.setVerificationCode(newVerificationCode);
        user.setVerificationCodeExpiration(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), newVerificationCode);
    }

    @Override
    @Transactional
    public void saveVerificationCode(String email, String code) {
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setVerificationCode(code);
        user.setVerificationCodeExpiration(LocalDateTime.now().plusMinutes(10)); // Kod ważny przez 10 minut
        userRepository.save(user);
    }
    
    @Override
    public boolean verifyCode(String email, String code) {
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
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
        User user = findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setVerificationCode(null);
        user.setVerificationCodeExpiration(null);
        userRepository.save(user);
    }

    @Override
    public String generateVerificationCode() {
        java.security.SecureRandom random = new java.security.SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    @Override
    public void verifyUser(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));
        
        user.setEnabled(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }
} 
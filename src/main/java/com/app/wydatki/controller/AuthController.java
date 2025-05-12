package com.app.wydatki.controller;

import com.app.wydatki.dto.LoginDTO;
import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.dto.VerificationRequestDTO;
import com.app.wydatki.enums.UserState;
import com.app.wydatki.model.User;
import com.app.wydatki.service.UserService;
import com.app.wydatki.service.email.EmailService;
import com.app.wydatki.service.request.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        log.info("Próba logowania dla użytkownika: {}", loginDTO.getEmail());
        
        try {
            log.info("Autoryzacja przez AuthenticationManager...");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
            );
            
            log.info("Autoryzacja udana, wygeneruję token JWT");
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginDTO.getEmail());
            String token = jwtUtil.generateToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);
            
            log.info("Token JWT wygenerowany pomyślnie");
            return ResponseEntity.ok(Map.of(
                "token", token,
                "refreshToken", refreshToken,
                "message", "Logowanie zakończone sukcesem."
            ));
        } catch (Exception e) {
            log.error("Błąd podczas logowania: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Nieprawidłowy email lub hasło: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            User registeredUser = userService.registerUser(userDTO);
            return ResponseEntity.ok(registeredUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during registration: " + e.getMessage());
        }
    }
    
    @PostMapping("/activate")
    public ResponseEntity<?> activateAccount(@RequestBody VerificationRequestDTO request) {
        try {
            boolean activated = userService.activateUserAccount(request);
            
            if (activated) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Konto zostało aktywowane. Możesz się teraz zalogować."
                ));
            }
            
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Nie udało się aktywować konta."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Błąd podczas aktywacji konta: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestBody VerificationRequestDTO verificationRequestDTO) {
        log.info("Otrzymano żądanie weryfikacji kodu dla: {}", verificationRequestDTO.getEmail());
        
        try {
            boolean isValid = userService.verifyCode(
                verificationRequestDTO.getEmail(), 
                verificationRequestDTO.getCode()
            );
            
            if (isValid) {
                User user = userService.findByEmail(verificationRequestDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje"));
                
                user.setStatus(UserState.ACTIVE);
                user.setEnabled(true);
                userService.clearVerificationCode(verificationRequestDTO.getEmail());
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Konto zostało aktywowane pomyślnie. Możesz się teraz zalogować."
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Nieprawidłowy kod weryfikacyjny lub kod wygasł."
                ));
            }
        } catch (Exception e) {
            log.error("Błąd podczas weryfikacji kodu: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Błąd podczas weryfikacji: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/resend-code")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        log.info("Otrzymano żądanie ponownego wysłania kodu weryfikacyjnego dla: {}", email);
        
        try {
            User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje"));
            
            if (user.isEnabled()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Konto jest już aktywne."
                ));
            }
            
            String newVerificationCode = userService.generateVerificationCode();
            user.setVerificationCode(newVerificationCode);
            user.setVerificationCodeExpiration(LocalDateTime.now().plusHours(24));
            userService.saveUser(user);
            
            emailService.sendVerificationEmail(email, newVerificationCode);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Kod weryfikacyjny został wysłany ponownie."
            ));
        } catch (Exception e) {
            log.error("Błąd podczas ponownego wysyłania kodu: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Błąd podczas wysyłania kodu: " + e.getMessage()
            ));
        }
    }


    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> refreshRequest) {
        String refreshToken = refreshRequest.get("refreshToken");
        
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Brak tokenu odświeżającego"
            ));
        }
        
        try {
            String username = jwtUtil.extractUsername(refreshToken);
            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "Nieprawidłowy token odświeżający"
                ));
            }
            
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            if (!jwtUtil.validateToken(refreshToken, userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "Token odświeżający wygasł lub jest nieprawidłowy"
                ));
            }
            
            String newToken = jwtUtil.generateToken(userDetails);
            String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);
            
            return ResponseEntity.ok(Map.of(
                "token", newToken,
                "refreshToken", newRefreshToken,
                "message", "Token został pomyślnie odświeżony"
            ));
        } catch (Exception e) {
            log.error("Błąd podczas odświeżania tokenu: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "message", "Błąd podczas odświeżania tokenu: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload, Authentication authentication) {
        String email = authentication.getName();
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");
        
        log.info("Żądanie zmiany hasła dla użytkownika: {}", email);
        
        try {
            userService.changePassword(email, currentPassword, newPassword);
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "Hasło zostało zmienione pomyślnie."
            ));
        } catch (Exception e) {
            log.error("Błąd podczas zmiany hasła: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false, 
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/deactivate-account")
    public ResponseEntity<?> deactivateAccount(Authentication authentication) {
        String email = authentication.getName();
        
        log.info("Żądanie dezaktywacji konta dla użytkownika: {}", email);
        
        try {
            userService.updateUserStatus(email, UserState.INACTIVE);
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "Konto zostało dezaktywowane pomyślnie."
            ));
        } catch (Exception e) {
            log.error("Błąd podczas dezaktywacji konta: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false, 
                "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(Authentication authentication) {
        String email = authentication.getName();
        
        log.info("Żądanie usunięcia konta dla użytkownika: {}", email);
        
        try {
            userService.deleteUser(email);
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "Konto zostało usunięte pomyślnie."
            ));
        } catch (Exception e) {
            log.error("Błąd podczas usuwania konta: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false, 
                "message", e.getMessage()
            ));
        }
    }
}
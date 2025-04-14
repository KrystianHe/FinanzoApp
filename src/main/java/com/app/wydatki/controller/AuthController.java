package com.app.wydatki.controller;

import com.app.wydatki.dto.LoginDTO;
import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.dto.VerificationRequestDTO;
import com.app.wydatki.dto.VerificationResponseDTO;
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
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;

import java.security.SecureRandom;
import java.util.Map;
import java.util.List;
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
    public ResponseEntity<?> registerUser(@RequestBody @Valid UserDTO userDTO, BindingResult bindingResult) {
        log.info("Otrzymano żądanie rejestracji dla: {}", userDTO.getEmail());
        log.info("Dane rejestracji: firstName={}, lastName={}, email={}, dateOfBirth={}", 
            userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail(), userDTO.getDateOfBirth());
        
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors()
                    .stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.toList());
            log.error("Błędy walidacji podczas rejestracji: {}", errors);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("errors", errors));
        }

        try {
            if (userService.findByEmail(userDTO.getEmail()).isPresent()) {
                log.warn("Próba rejestracji na istniejący email: {}", userDTO.getEmail());
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "Użytkownik o podanym adresie email już istnieje."
                ));
            }
            
            User registeredUser = userService.registerUser(userDTO);
            log.info("Użytkownik zarejestrowany pomyślnie: id={}, email={}, status={}, enabled={}", 
                registeredUser.getId(), registeredUser.getEmail(), registeredUser.getStatus(), registeredUser.isEnabled());
            
            return ResponseEntity.ok(Map.of(
                "message", "Rejestracja zakończona sukcesem.",
                "userId", registeredUser.getId(),
                "verificationRequired", true
            ));
        } catch (Exception e) {
            log.error("Błąd podczas rejestracji użytkownika: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Błąd podczas rejestracji: " + e.getMessage()
            ));
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
    
    @PostMapping("/test-activate")
    public ResponseEntity<?> testActivateAccount(@RequestParam String email) {
        log.info("Żądanie testowej aktywacji konta dla: {}", email);
        
        try {
            User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje"));
            
            user.setStatus(UserState.ACTIVE);
            user.setEnabled(true);
            user.setVerificationCode(null);
            user.setVerificationCodeExpiration(null);
            userService.saveUser(user);
            
            log.info("Konto zostało aktywowane bez weryfikacji dla: {}", email);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Konto zostało aktywowane testowo."
            ));
        } catch (Exception e) {
            log.error("Błąd podczas testowej aktywacji: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Błąd podczas aktywacji: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/test-user-info")
    public ResponseEntity<?> testUserInfo(@RequestParam String email) {
        log.info("Żądanie wyświetlenia informacji o użytkowniku: {}", email);
        
        try {
            User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje"));
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("email", user.getEmail());
            userInfo.put("firstName", user.getFirstName());
            userInfo.put("lastName", user.getLastName());
            userInfo.put("status", user.getStatus());
            userInfo.put("enabled", user.isEnabled());
            userInfo.put("encodedPassword", user.getPassword().substring(0, 10) + "..."); // Pokazujemy tylko początek zakodowanego hasła
            
            log.info("Informacje o użytkowniku pobrane: {}", userInfo);
            
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            log.error("Błąd podczas pobierania informacji o użytkowniku: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Błąd: " + e.getMessage()
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
}
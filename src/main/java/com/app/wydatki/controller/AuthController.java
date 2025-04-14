package com.app.wydatki.controller;

import com.app.wydatki.dto.LoginDTO;
import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.dto.VerificationRequestDTO;
import com.app.wydatki.dto.VerificationResponseDTO;
import com.app.wydatki.request.UserActivateAccount;
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

import java.security.SecureRandom;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

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
    public ResponseEntity<VerificationResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        // Pierwszy etap logowania-weryfikacja hasła
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );
        
        // Generowanie kodu weryfikacyjnego i wysłanie go na email
        String verificationCode = generateVerificationCode();
        userService.saveVerificationCode(loginDTO.getEmail(), verificationCode);
        
        // Wysyłanie kodu weryfikacyjnego na adres email
        emailService.sendVerificationEmail(loginDTO.getEmail(), verificationCode);
        
        // Zwracanie tymczasowego tokenu
        String temporaryToken = jwtUtil.generateTemporaryToken(loginDTO.getEmail());
        
        return ResponseEntity.ok(new VerificationResponseDTO(temporaryToken, "Kod weryfikacyjny został wysłany na Twój adres email."));
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationRequestDTO verificationRequest) {
        // Sprawdzanie poprawności tymczasowego tokenu
        String email = jwtUtil.extractUsername(verificationRequest.getToken());
        
        // Weryfikacja kodu
        boolean isValid = userService.verifyCode(email, verificationRequest.getVerificationCode());
        
        if (isValid) {
            // Usunięcie kodu weryfikacyjnego
            userService.clearVerificationCode(email);
            
            // Generowanie pełnego tokenu JWT
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            String token = jwtUtil.generateToken(userDetails);
            
            return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "Logowanie zakończone sukcesem."
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Nieprawidłowy kod weryfikacyjny."
            ));
        }
    }
    
    @PostMapping("/resend-code")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String token) {
        try {
            // Sprawdzanie poprawności tymczasowego tokenu
            String email = jwtUtil.extractUsername(token);
            
            // Generowanie nowego kodu weryfikacyjnego
            String verificationCode = generateVerificationCode();
            userService.saveVerificationCode(email, verificationCode);
            
            // Ponowne wysłanie kodu na email
            emailService.sendVerificationEmail(email, verificationCode);
            
            return ResponseEntity.ok(Map.of(
                "message", "Nowy kod weryfikacyjny został wysłany na Twój adres email."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Nie udało się wysłać kodu weryfikacyjnego."
            ));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            // Sprawdzenie, czy użytkownik o podanym emailu już istnieje
            if (userService.findByEmail(userDTO.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "Użytkownik o podanym adresie email już istnieje."
                ));
            }
            
            // Rejestracja użytkownika
            userService.registerUser(userDTO);
            
            return ResponseEntity.ok(Map.of(
                "message", "Rejestracja zakończona sukcesem. Sprawdź swoją skrzynkę email, aby aktywować konto."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Błąd podczas rejestracji: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/activate")
    public ResponseEntity<?> activateAccount(@RequestBody UserActivateAccount request) {
        try {
            boolean activated = userService.activateUserAccount(request);
            
            if (activated) {
                return ResponseEntity.ok(Map.of(
                    "message", "Konto zostało aktywowane. Możesz się teraz zalogować."
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "Nie udało się aktywować konta."
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Błąd podczas aktywacji konta: " + e.getMessage()
            ));
        }
    }
    
    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // 6-cyfrowy kod
        return String.valueOf(code);
    }
}
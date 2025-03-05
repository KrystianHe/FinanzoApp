package com.app.wydatki.controller;

import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.enums.UserState;
import com.app.wydatki.model.User;
import com.app.wydatki.request.UserActivateAccount;
import com.app.wydatki.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerNewUser(@RequestBody @Valid UserDTO userDTO) {
        try {
            User user = userService.registerUser(userDTO);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Error during user registration: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/updateUserStatus")
    public ResponseEntity<?> updateUserStatus(@RequestBody UserDTO userDTO) {
        try {
            UserState userState = userService.updateUserStatus(userDTO.getEmail(), UserState.valueOf(userDTO.getStatus()));
            return ResponseEntity.ok(userState);
        } catch (Exception e) {
            log.error("Error during user status update: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getUserList() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/activate-account")
    public ResponseEntity<String> activateAccount(@RequestBody UserActivateAccount request) {
        try {
            boolean activated = userService.activateUserAccount(request);
            if (activated) {
                return ResponseEntity.ok("Konto zostało aktywowane pomyślnie");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nie udało się aktywować konta");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/resend-verification-code")
    public ResponseEntity<String> resendVerificationCode(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            userService.resendVerificationCode(email);
            return ResponseEntity.ok("Kod weryfikacyjny został wysłany ponownie na adres email: " + email);
        } catch (Exception e) {
            log.error("Błąd podczas wysyłania kodu weryfikacyjnego: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.findByEmail(userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid UserDTO userDTO) {
        User updatedUser = userService.updateUser(userDetails.getUsername(), userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        try {
            userService.changePassword(
                    userDetails.getUsername(),
                    request.get("currentPassword"),
                    request.get("newPassword")
            );
            return ResponseEntity.ok("Hasło zostało zmienione pomyślnie");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            userService.sendPasswordResetEmail(request.get("email"));
            return ResponseEntity.ok("Email z instrukcją resetowania hasła został wysłany");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        try {
            userService.resetPassword(request.get("token"), request.get("newPassword"));
            return ResponseEntity.ok("Hasło zostało zresetowane pomyślnie");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteAccount(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            userService.deleteUser(userDetails.getUsername());
            return ResponseEntity.ok("Konto zostało usunięte pomyślnie");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/me/preferences")
    public ResponseEntity<Map<String, String>> getUserPreferences(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserPreferences(userDetails.getUsername()));
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<Map<String, String>> updateUserPreferences(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> preferences) {
        return ResponseEntity.ok(userService.updateUserPreferences(userDetails.getUsername(), preferences));
    }
}

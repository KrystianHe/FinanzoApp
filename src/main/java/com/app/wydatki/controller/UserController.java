package com.app.wydatki.controller;

import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.exceptions.UserAlreadyExistsException;
import com.app.wydatki.impl.UserServiceImpl;
import com.app.wydatki.model.User;
import com.app.wydatki.request.UserActivateAccount;
import com.app.wydatki.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.common.VerificationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserServiceImpl userServiceImpl;

    @PostMapping("/register")
    public ResponseEntity<?> registerNewUser(@RequestBody @Valid UserDTO userDTO) {
        try {
            User registeredUser = userService.registerUser(userDTO);
            return ResponseEntity.ok(registeredUser);
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/updateUserStatus")
    public ResponseEntity<?> updateUserStatus(@RequestBody UserDTO userDTO) {
        try {
            String registeredUser = String.valueOf(userService.findByEmail(userDTO.getEmail()));

            userService.updateUserStatus(userDTO.getEmail(), userDTO.getStatus());
            return ResponseEntity.ok(registeredUser);
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }


    @GetMapping("/all")
    public ResponseEntity<?> getUserList() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/activate-account")
    public ResponseEntity<String> activateAccount(@RequestBody UserActivateAccount request) throws VerificationException {
        boolean isActivated = userService.activateUserAccount(request);
        if (isActivated) {
            return ResponseEntity.ok("Konto zostało aktywowane!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Niepoprawny kod weryfikacyjny.");
        }
    }

    @PostMapping("/resend-verification-code")
    public ResponseEntity<String> resendVerificationCode(@RequestBody Map<String, String> request) throws VerificationException {
        String email = request.get("email");
        userServiceImpl.resendVerificationCode(email);
        return ResponseEntity.ok("Nowy kod weryfikacyjny został wysłany na email.");
    }


}

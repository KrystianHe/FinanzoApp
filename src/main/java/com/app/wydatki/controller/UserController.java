package com.app.wydatki.controller;


import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.exceptions.UserAlreadyExistsException;
import com.app.wydatki.model.User;
import com.app.wydatki.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
@Slf4j
public class UserController {

    private UserService userService;


    @GetMapping(value = "/all")
    @PreAuthorize("hasPermission('/users/all')")
    public List<User> getUserList() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public ResponseEntity registerNewUser(@RequestBody @Valid UserDTO userDTO) {
        try {
            User registeredUser = userService.registerUser(userDTO);
            return ResponseEntity.ok(registeredUser);
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}


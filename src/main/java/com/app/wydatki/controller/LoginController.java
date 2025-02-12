package com.app.wydatki.controller;


import com.app.wydatki.dto.LoginDTO;
import com.app.wydatki.dto.response.JwtAuthenticationResponseDTO;
import com.app.wydatki.service.UserService;
import com.google.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class LoginController {
    @Autowired
    private HttpServletRequest request;

    @Inject
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponseDTO> login(@Valid @RequestBody LoginDTO request){
        return ResponseEntity.ok();
    }
}

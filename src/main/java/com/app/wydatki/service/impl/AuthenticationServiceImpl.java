package com.app.wydatki.service.impl;

import com.app.wydatki.dto.LoginDTO;
import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.dto.response.JwtAuthenticationResponseDTO;
import com.app.wydatki.model.User;
import com.app.wydatki.service.AuthenticationService;
import com.app.wydatki.service.JwtService;
import com.app.wydatki.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    @Override
    public JwtAuthenticationResponseDTO login(LoginDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);

        return JwtAuthenticationResponseDTO.builder()
                .token(token)
                .build();
    }

    @Override
    public JwtAuthenticationResponseDTO register(UserDTO request) {
        User user = userService.registerUser(request);
        UserDetails userDetails = userService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return JwtAuthenticationResponseDTO.builder()
                .token(token)
                .build();
    }
} 
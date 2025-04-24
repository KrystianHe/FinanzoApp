package com.app.wydatki.service;

import com.app.wydatki.dto.LoginDTO;
import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.dto.response.JwtAuthenticationResponseDTO;

public interface AuthenticationService {
    JwtAuthenticationResponseDTO login(LoginDTO request);
    JwtAuthenticationResponseDTO register(UserDTO request);
} 
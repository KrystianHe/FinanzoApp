package com.app.wydatki.service.request;


import com.app.wydatki.dto.LoginDTO;
import com.app.wydatki.dto.response.JwtAuthenticationResponseDTO;

public interface AuthenticationService {
    JwtAuthenticationResponseDTO signin(LoginDTO request);

    JwtAuthenticationResponseDTO loginApp(LoginDTO request);
}

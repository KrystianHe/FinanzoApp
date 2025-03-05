package com.app.wydatki.service.request.service;


import com.app.wydatki.dto.LoginDTO;
import com.app.wydatki.dto.response.JwtAuthenticationResponseDTO;

public interface AuthenticationService {
    JwtAuthenticationResponseDTO signin(LoginDTO request);

}

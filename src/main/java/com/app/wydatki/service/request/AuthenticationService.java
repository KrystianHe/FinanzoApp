package com.app.mainbudgetapplication.service.request;

import com.app.mainbudgetapplication.dto.LoginDTO;
import com.app.mainbudgetapplication.dto.response.JwtAuthenticationResponseDTO;

public interface AuthenticationService {
    JwtAuthenticationResponseDTO signin(LoginDTO request);

    JwtAuthenticationResponseDTO loginApp(LoginDTO request);
}

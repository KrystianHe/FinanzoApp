package com.app.wydatki.service.request.service;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;

public interface JwtService {
    String extractUserName(String token);

    Date extractExpiration(String token);

    String generateToken(UserDetails userDetails);

    boolean isTokenValid(String token, UserDetails userDetails);
}

package com.app.wydatki.service.request.service;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.function.Function;

public interface JwtService {
    String extractUsername(String token);
    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    Date extractExpiration(String token);

    String generateToken(UserDetails userDetails);
    boolean validateToken(String token, UserDetails userDetails);
    boolean isTokenExpired(String token);
    Claims extractAllClaims(String token);
}

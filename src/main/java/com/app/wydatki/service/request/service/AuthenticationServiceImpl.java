package com.app.wydatki.service.request.service;


import com.app.wydatki.dto.LoginDTO;
import com.app.wydatki.dto.response.JwtAuthenticationResponseDTO;
import com.app.wydatki.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;

    @Override
    public JwtAuthenticationResponseDTO signin(LoginDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        var user = userRepository.getUserByLogin(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid login data"));


        String jwt = jwtService.generateToken((UserDetails) user);
        return JwtAuthenticationResponseDTO.builder()
                .accessToken(jwt)
                .userId(user.getId())
                .build();
    }

    @Override
    public JwtAuthenticationResponseDTO loginApp(LoginDTO request) {
        return null;
    }
}


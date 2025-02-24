package com.app.wydatki.impl;

import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.enums.UserState;
import com.app.wydatki.enums.UserType;
import com.app.wydatki.exceptions.NotFoundUserExceptions;
import com.app.wydatki.exceptions.UserAlreadyExistsException;
import com.app.wydatki.model.User;
import com.app.wydatki.repository.UserRepository;
import com.app.wydatki.service.SendEmailService;
import com.app.wydatki.service.UserService;
import com.app.wydatki.utils.EmailCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SendEmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserState updateUserStatus(String email, UserState newState, String verificationCode) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundUserExceptions("Użytkownik z podanym e-mailem nie istnieje w bazie"));

        if (newState == UserState.INACTIVE && statusChangeRequiresCode) {
            if (user.getVerificationCode() == null || !user.getVerificationCode().equals(verificationCode)) {
                throw new IllegalArgumentException("Kod weryfikacyjny jest niepoprawny lub wygasł.");
            }

            user.setVerificationCode(null);
        }

        // Zmiana statusu użytkownika
        user.setStatus(newState);
        userRepository.save(user);

        return newState;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User registerUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new UserAlreadyExistsException("Użytkownik z podanym e-mailem już istnieje.");
        }

        User newUser = new User();
        newUser.setName(userDTO.getName());
        newUser.setLastname(userDTO.getLastname());
        newUser.setEmail(userDTO.getEmail());
        newUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        newUser.setType(UserType.USER);
        newUser.setStatus(UserState.INACTIVE);

        User savedUser = userRepository.save(newUser);

        emailService.sendVerificationCode(savedUser.getEmail(), EmailCodeGenerator.generateCode().getCode());

        return savedUser;
    }

}

package com.app.wydatki.impl;

import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.enums.UserState;
import com.app.wydatki.enums.UserType;
import com.app.wydatki.exceptions.NotFoundUserExceptions;
import com.app.wydatki.exceptions.UserAlreadyExistsException;
import com.app.wydatki.model.User;
import com.app.wydatki.repository.UserRepository;
import com.app.wydatki.request.UserActivateAccount;
import com.app.wydatki.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public boolean activateUserAccount(UserActivateAccount userActivateAccount) {
        User user = userRepository.findByEmailAndVerificationCode(
                userActivateAccount.getEmail(), userActivateAccount.getVerificationCode()
        ).orElseThrow(() -> new NotFoundUserExceptions("Niepoprawny email lub kod weryfikacyjny."));

        user.setStatus(UserState.ACTIVE);
        user.setVerificationCode(null);
        userRepository.save(user);
        return true;
    }

    @Override
    public UserState updateUserStatus(String email, UserState newState) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundUserExceptions("Użytkownik z podanym e-mailem nie istnieje w bazie"));

        if (user.getStatus() == newState) {
            throw new IllegalArgumentException("Nowy status nie może być taki sam jak obecny.");
        }

        user.setStatus(newState);
        userRepository.save(user);
        return newState;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User registerUser(UserDTO userDTO, String verificationCode) {
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
        newUser.setVerificationCode(verificationCode);

        return userRepository.save(newUser);
    }
}

package com.app.wydatki.service;



import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.dto.fiilter.UserFilterDTO;
import com.app.wydatki.enums.UserState;
import com.app.wydatki.enums.UserType;
import com.app.wydatki.exceptions.UserAlreadyExistsException;
import com.app.wydatki.model.User;
import com.app.wydatki.repository.UserRepository;
import com.app.wydatki.utils.EmailCodeGenerator;
import lombok.Data;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
@Data
public abstract class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SendEmailService emailService;



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

    public abstract Optional<User> findUsers(UserFilterDTO userFilterDTO);

    public abstract List<User> getAllUsers();
}

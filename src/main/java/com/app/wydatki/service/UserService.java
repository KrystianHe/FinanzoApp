package com.app.wydatki.service;

import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.enums.UserState;
import com.app.wydatki.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(UserDTO userDTO);
    String findByEmail(String email);
    UserState updateUserStatus(String email, UserState userState);
    List<User> getAllUsers();
}

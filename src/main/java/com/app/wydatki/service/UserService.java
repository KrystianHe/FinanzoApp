package com.app.wydatki.service;

import com.app.wydatki.dto.UserDTO;
import com.app.wydatki.enums.UserState;
import com.app.wydatki.model.User;
import com.app.wydatki.request.UserActivateAccount;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(UserDTO userDTO, String verificationCode);
    Optional<User> findByEmail(String email);

    boolean activateUserAccount(UserActivateAccount userActivateAccount);

    UserState updateUserStatus(String email, UserState userState);

    List<User> getAllUsers();
}

package com.app.wydatki.impl;


import com.app.wydatki.dto.fiilter.UserFilterDTO;
import com.app.wydatki.model.User;
import com.app.wydatki.repository.UserRepository;
import com.app.wydatki.service.UserService;
import lombok.Data;

import java.util.List;
import java.util.Optional;

@Data
public class UserServiceImpl extends UserService {

    private UserRepository userRepository;

    @Override
    public Optional<User> findUsers(UserFilterDTO userFilterDTO) {
        return userRepository.getUserByLogin(userFilterDTO.getLogin());
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.getAllUsers();
    }

}

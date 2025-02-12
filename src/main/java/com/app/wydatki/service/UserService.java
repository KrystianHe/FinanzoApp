package com.app.wydatki.service;



import com.app.wydatki.dto.fiilter.UserFilterDTO;
import com.app.wydatki.model.User;

import java.util.List;
import java.util.Optional;


public interface UserService {

    Optional<User> findUsers(UserFilterDTO userFilterDTO);

    List<User> getAllUsers();


}

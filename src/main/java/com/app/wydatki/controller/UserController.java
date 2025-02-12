package com.app.wydatki.controller;


import com.app.wydatki.dto.fiilter.UserFilterDTO;
import com.app.wydatki.dto.response.ObjectAndTotalResponse;
import com.app.wydatki.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin
@Slf4j
public class UserController {


    @Autowired
    private UserService userService;

    @PostMapping(value = "/all")
    @PreAuthorize("hasPermission('/users/all')")
    public ObjectAndTotalResponse getUserList(@RequestBody UserFilterDTO userFilterDTO) {
        return null;
    }


}

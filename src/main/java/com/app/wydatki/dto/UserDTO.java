package com.app.wydatki.dto;


import com.app.wydatki.enums.UserState;
import com.app.wydatki.enums.UserType;
import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Builder
@Data
public class UserDTO implements Serializable {

    private Long id;
    private String name;
    private String password;
    private String lastname;
    private String email;
    private String login;
    private UserState status;
    private UserType userType;
    private String verificationCode;



}

package com.app.wydatki.dto.fiilter;


import com.app.wydatki.enums.UserState;
import com.app.wydatki.enums.UserType;
import lombok.Builder;
import lombok.Data;

@Builder(toBuilder = true)
@Data
public class UserFilterDTO {

    private Long id;
    private String name;
    private String lastname;
    private String email;
    private String login;
    private UserState status;
    private UserType userType;
}

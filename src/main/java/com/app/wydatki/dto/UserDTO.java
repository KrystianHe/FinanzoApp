package com.app.wydatki.dto;

import com.app.wydatki.enums.UserState;
import com.app.wydatki.enums.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO implements Serializable {

    private Long id;
    
    @NotBlank(message = "Imię nie może być puste")
    private String firstName;
    
    @NotBlank(message = "Hasło nie może być puste")
    @Size(min = 8, message = "Hasło musi mieć co najmniej 8 znaków")
    private String password;
    
    @NotBlank(message = "Nazwisko nie może być puste")
    private String lastName;
    
    @NotBlank(message = "Email nie może być pusty")
    @Email(message = "Niepoprawny format adresu email")
    private String email;
    
    private String status;
}

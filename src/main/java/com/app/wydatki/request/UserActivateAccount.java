package com.app.wydatki.request;

import lombok.Data;

@Data
public class UserActivateAccount {
    public String email;
    public String verificationCode;
}

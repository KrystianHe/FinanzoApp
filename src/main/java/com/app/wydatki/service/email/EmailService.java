package com.app.wydatki.service.email;


public interface EmailService {
    void sendVerificationEmail(String email, String verificationCode);
    void sendPasswordResetEmail(String email, String resetToken);
} 
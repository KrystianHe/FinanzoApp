package com.app.wydatki.service.email;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service("emailServiceV2")
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String email, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Weryfikacja konta");
        message.setText("Twój kod weryfikacyjny to: " + verificationCode + "\n" +
                       "Kod jest ważny przez 24 godziny.");
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String email, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Resetowanie hasła");
        message.setText("Aby zresetować hasło, kliknij w poniższy link:\n" +
                       "http://localhost:8080/reset-password?token=" + resetToken + "\n" +
                       "Link jest ważny przez 24 godziny.");
        mailSender.send(message);
    }

    public void resendVerificationCode(String email, String verificationCode) {
        sendVerificationEmail(email, verificationCode);
    }
} 
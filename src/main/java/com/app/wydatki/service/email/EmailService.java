package com.app.wydatki.service.email;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service("emailServiceV2")
@RequiredArgsConstructor
public class EmailService {
    private final SendGrid sendGrid;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @Value("${sendgrid.from.name}")
    private String fromName;

    public void sendVerificationEmail(String email, String verificationCode) {
        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(email);
            String subject = "Weryfikacja konta";
            Content content = new Content("text/plain", 
                "Twój kod weryfikacyjny to: " + verificationCode + "\n" +
                "Kod jest ważny przez 24 godziny.");
            
            Mail mail = new Mail(from, subject, to, content);
            sendEmail(mail);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}", email, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public void sendPasswordResetEmail(String email, String resetToken) {
        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(email);
            String subject = "Resetowanie hasła";
            Content content = new Content("text/plain",
                "Aby zresetować hasło, kliknij w poniższy link:\n" +
                "http://localhost:8080/reset-password?token=" + resetToken + "\n" +
                "Link jest ważny przez 24 godziny.");
            
            Mail mail = new Mail(from, subject, to, content);
            sendEmail(mail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}", email, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    private void sendEmail(Mail mail) throws Exception {
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        
        Response response = sendGrid.api(request);
        if (response.getStatusCode() < 200 || response.getStatusCode() >= 300) {
            throw new RuntimeException("Failed to send email: " + response.getBody());
        }
    }

    public void resendVerificationCode(String email, String verificationCode) {
        sendVerificationEmail(email, verificationCode);
    }
} 
package com.app.wydatki.service.email;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final SendGrid sendGrid;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @Value("${sendgrid.from.name}")
    private String fromName;

    @Override
    public void sendVerificationEmail(String email, String verificationCode) {
        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(email);
            String subject = "Weryfikacja konta - MojeWydatki";

            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            font-family: Arial, sans-serif;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo {
                            max-width: 150px;
                            margin-bottom: 20px;
                        }
                        .verification-code {
                            background-color: #f8f9fa;
                            border-radius: 8px;
                            padding: 20px;
                            text-align: center;
                            margin: 30px 0;
                        }
                        .code {
                            font-size: 32px;
                            font-weight: bold;
                            color: #1e3c72;
                            letter-spacing: 4px;
                            margin: 10px 0;
                        }
                        .footer {
                            text-align: center;
                            color: #6c757d;
                            font-size: 12px;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #dee2e6;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="cid:logo" alt="MojeWydatki Logo" class="logo">
                            <h1 style="color: #1e3c72; margin: 0;">Weryfikacja konta</h1>
                        </div>
                        
                        <p>Witaj,</p>
                        <p>Dziękujemy za rejestrację w serwisie MojeWydatki. Aby aktywować swoje konto, użyj poniższego kodu weryfikacyjnego:</p>
                        
                        <div class="verification-code">
                            <p style="margin: 0; color: #666;">Twój kod weryfikacyjny:</p>
                            <div class="code">%s</div>
                            <p style="margin: 0; color: #666;">Kod jest ważny przez 24 godziny.</p>
                        </div>
                        
                        <p>Jeśli nie rejestrowałeś się w serwisie MojeWydatki, zignoruj tę wiadomość.</p>
                        
                        <div class="footer">
                            <p>© 2024 MojeWydatki. Wszelkie prawa zastrzeżone.</p>
                            <p>Ta wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać.</p>
                        </div>
                    </div>
                </body>
                </html>
                """, verificationCode);

            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, to, content);

            // Add logo as inline attachment
            ClassPathResource logoResource = new ClassPathResource("static/logoMW.jpg");
            byte[] logoBytes = Files.readAllBytes(logoResource.getFile().toPath());
            String base64Logo = Base64.getEncoder().encodeToString(logoBytes);

            Attachments attachments = new Attachments();
            attachments.setFilename("logoMW.jpg");
            attachments.setType("image/jpeg");
            attachments.setDisposition("inline");
            attachments.setContentId("logo");
            attachments.setContent(base64Logo);
            mail.addAttachments(attachments);

            // Send the email
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Email weryfikacyjny wysłany pomyślnie do: {}", email);
            } else {
                log.error("Błąd podczas wysyłania emaila weryfikacyjnego: {}", response.getBody());
                throw new RuntimeException("Nie udało się wysłać emaila weryfikacyjnego");
            }
        } catch (Exception e) {
            log.error("Nie udało się wysłać emaila weryfikacyjnego do {}", email, e);
            throw new RuntimeException("Nie udało się wysłać emaila weryfikacyjnego", e);
        }
    }

    @Override
    public void sendPasswordResetEmail(String email, String resetToken) {
        // TODO: Implement password reset email functionality
        throw new UnsupportedOperationException("Password reset email functionality not implemented yet");
    }
} 
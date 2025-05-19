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
            String subject = "Weryfikacja konta - Finanzo";

            // Użyj publicznego URL dla logo
            String logoUrl = "https://i.imgur.com/NxGJyoS.png"; // Przykładowe logo Finanzo (należy podmienić na właściwy URL)

            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Weryfikacja konta - Finanzo</title>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .email-container {
                            background-color: #ffffff;
                            border-radius: 10px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                            padding: 30px;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo {
                            max-width: 200px;
                            height: auto;
                            margin-bottom: 20px;
                        }
                        .verification-code {
                            background: linear-gradient(135deg, rgba(30, 60, 114, 0.1) 0%%, rgba(42, 82, 152, 0.1) 100%%);
                            border-radius: 8px;
                            padding: 20px;
                            text-align: center;
                            margin: 30px 0;
                        }
                        .code {
                            font-size: 32px;
                            font-weight: bold;
                            color: #1e3c72;
                            letter-spacing: 5px;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            color: #666;
                            font-size: 12px;
                        }
                        .divider {
                            border-top: 1px solid #eee;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="email-container">
                            <div class="header">
                                <img src="%s" alt="Finanzo Logo" class="logo">
                                <h1 style="color: #1e3c72; margin: 0;">Weryfikacja konta</h1>
                            </div>
                            
                            <p>Witaj,</p>
                            <p>Dziękujemy za rejestrację w serwisie Finanzo. Aby aktywować swoje konto, użyj poniższego kodu weryfikacyjnego:</p>
                            
                            <div class="verification-code">
                                <p style="margin: 0; color: #666;">Twój kod weryfikacyjny:</p>
                                <div class="code">%s</div>
                                <p style="margin: 0; color: #666;">Kod jest ważny przez 24 godziny.</p>
                            </div>
                            
                            <p>Jeśli nie rejestrowałeś się w serwisie Finanzo, zignoruj tę wiadomość.</p>
                            
                            <div class="divider"></div>
                            
                            <div class="footer">
                                <p>© 2024 Finanzo. Wszelkie prawa zastrzeżone.</p>
                                <p>Ta wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """, logoUrl, verificationCode);

            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, to, content);

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
        throw new UnsupportedOperationException("Password reset email functionality not implemented yet");
    }
} 
package com.app.wydatki.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class SendEmailService {

    private static final Logger logger = LoggerFactory.getLogger(SendEmailService.class);

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String content) {
        Email from = new Email(fromEmail);
        Email toEmail = new Email(to);
        Content emailContent = new Content("text/plain", content);
        Mail mail = new Mail(from, subject, toEmail, emailContent);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            sg.api(request);
            logger.info("E-mail został wysłany pomyślnie do: {}", to);
        } catch (IOException e) {
            throw new RuntimeException("Błąd wysyłania e-maila: " + e.getMessage());
        }
    }

    public void sendVerificationCode(String to, String verificationCode) {
        String subject = "Kod weryfikacyjny do Smart Inventory";
        String content = "Twój kod weryfikacyjny to: " + verificationCode + "\n\n" +
                "Kod jest ważny przez 5 minut.";

        sendEmail(to, subject, content);
    }
}

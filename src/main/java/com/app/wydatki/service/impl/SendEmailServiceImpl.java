package com.app.wydatki.service.impl;

import com.app.wydatki.service.SendEmailService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class SendEmailServiceImpl extends SendEmailService {

    @Value("${sendgrid.api-key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @Value("${sendgrid.from.name}")
    private String fromName;

    @Override
    public void sendVerificationCode(String email, String verificationCode) {
        String subject = "Kod weryfikacyjny";
        String content = String.format("Twój kod weryfikacyjny to: %s", verificationCode);
        sendEmail(email, subject, content);
    }

    @Override
    public void sendEmail(String to, String subject, String content) {
        Email from = new Email(fromEmail, fromName);
        Email toEmail = new Email(to);
        Content emailContent = new Content("text/plain", content);
        Mail mail = new Mail(from, subject, toEmail, emailContent);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            if (response.getStatusCode() < 200 || response.getStatusCode() >= 300) {
                throw new RuntimeException("Błąd podczas wysyłania emaila: " + response.getBody());
            }
        } catch (IOException ex) {
            throw new RuntimeException("Błąd podczas wysyłania emaila", ex);
        }
    }
} 
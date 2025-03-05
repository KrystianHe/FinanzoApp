package com.app.wydatki.config;

import com.app.wydatki.service.SendEmailService;
import com.app.wydatki.service.email.EmailService;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;

@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public JavaMailSender javaMailSender() {
        return Mockito.mock(JavaMailSender.class);
    }

    @Bean
    @Primary
    public EmailService emailService() {
        return Mockito.mock(EmailService.class);
    }
    
    @Bean
    @Primary
    public com.app.wydatki.service.email.EmailService emailServiceV2() {
        return Mockito.mock(com.app.wydatki.service.email.EmailService.class);
    }

    @Bean
    @Primary
    public SendEmailService sendEmailService() {
        return Mockito.mock(SendEmailService.class);
    }
} 
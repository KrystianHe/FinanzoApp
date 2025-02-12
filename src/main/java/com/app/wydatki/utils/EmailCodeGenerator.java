package com.app.wydatki.utils;

import java.security.SecureRandom;
import java.time.LocalDateTime;

public class EmailCodeGenerator {

    private static final long CODE_EXPIRATION_MINUTES = 5;

    public static class VerificationCode {
        private String code;
        private LocalDateTime expirationTime;

        public VerificationCode(String code, LocalDateTime expirationTime) {
            this.code = code;
            this.expirationTime = expirationTime;
        }

        public String getCode() {
            return code;
        }

        public LocalDateTime getExpirationTime() {
            return expirationTime;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expirationTime);
        }
    }

    public static VerificationCode generateCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);

        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(CODE_EXPIRATION_MINUTES);
        return new VerificationCode(String.valueOf(code), expirationTime);
    }

}

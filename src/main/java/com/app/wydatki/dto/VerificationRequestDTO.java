package com.app.wydatki.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerificationRequestDTO {
    @NotBlank
    private String email;
    
    @NotBlank
    private String code;
} 
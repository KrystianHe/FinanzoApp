package com.app.wydatki.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthenticationResponseDTO {

    private String accessToken;

    private Long userId;

    public JwtAuthenticationResponseDTO(String token) {
    }
}

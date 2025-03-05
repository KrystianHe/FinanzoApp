package com.app.wydatki.dto.response;

import lombok.Builder;
import lombok.Value;

import jakarta.validation.Valid;

@Builder(toBuilder = true)
@Value
public class ObjectAndTotalResponse {
    private Object list;
    private Long total;
}

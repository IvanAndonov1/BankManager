package com.bank.dto;

import java.util.List;

public record ValidationErrorResponse(
        List<String> errors
) {}

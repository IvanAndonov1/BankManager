package com.bank.dto;

import java.util.List;

public record DecisionRequestDto(
        boolean approve,
        List<String> reasons
) {}

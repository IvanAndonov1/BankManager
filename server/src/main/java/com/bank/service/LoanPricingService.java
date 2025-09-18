package com.bank.service;

import com.bank.dto.LoanPricingDto;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class LoanPricingService {

    private static final BigDecimal ANNUAL_RATE = BigDecimal.valueOf(0.05);
    private static final BigDecimal MAX_AMOUNT = BigDecimal.valueOf(50_000);
    private static final int MAX_TERM_MONTHS = 120;

    public LoanPricingDto calculate (BigDecimal principal, int termMonths){

        if(principal == null || principal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive!");
        }

        if(principal.compareTo(MAX_AMOUNT) > 0) {
            throw new IllegalArgumentException("Maximum allowed amount is 50,000 EUR!");
        }

        if(termMonths <= 0 || termMonths > MAX_TERM_MONTHS) {
            throw new IllegalArgumentException("Term must be between 1 and 120 months!");
        }

        BigDecimal monthlyRate = ANNUAL_RATE.divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP);
        double r  = monthlyRate.doubleValue();
        double n = termMonths;
        double P = principal.doubleValue();

        double A = P * (r / (1 - Math.pow(1 + r, -n)));
        BigDecimal monthlyPayment = BigDecimal.valueOf(A).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = monthlyPayment.multiply(BigDecimal.valueOf(termMonths));

        return new LoanPricingDto(ANNUAL_RATE, monthlyPayment, total);

    }

}

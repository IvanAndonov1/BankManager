package com.bank.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class LoanPricingService {

    public BigDecimal rateForTermMonths(int termMonths){

        if(termMonths < 12 || termMonths > 240)
            throw new IllegalArgumentException("Term months must be from 12 to 240!");

        if (termMonths <= 24)
            return new BigDecimal("0.065"); // 6.50%
        if (termMonths <= 60)
            return new BigDecimal("0.072"); // 7.20%
        if (termMonths <= 120)
            return new BigDecimal("0.080"); // 8.00%
        if (termMonths <= 180)
            return new BigDecimal("0.088"); // 8.80%

        return new BigDecimal("0.095");

    }

    public BigDecimal annuityPayment(BigDecimal principal, int termMonths, BigDecimal annualRate){

        if (principal.signum() <= 0)
            throw new IllegalArgumentException("Amount must be > 0!");

        if (termMonths <= 0)
            throw new IllegalArgumentException("Term months must be > 0!");

        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("12"), 12, RoundingMode.HALF_UP);

        if (monthlyRate.compareTo(BigDecimal.ZERO) == 0) {
            return principal.divide(new BigDecimal(termMonths), 2, RoundingMode.HALF_UP);
        }

        double i = monthlyRate.doubleValue();
        double n = termMonths;
        double P = principal.doubleValue();

        double A = P * (i / (1 - Math.pow(1 + i, -n)));
        return BigDecimal.valueOf(A).setScale(2, RoundingMode.HALF_UP);

    }

    public BigDecimal totalPayable(BigDecimal monthlyPayment, int termMonths){

        return monthlyPayment.multiply(new BigDecimal(termMonths)).setScale(2, RoundingMode.HALF_UP);

    }

}

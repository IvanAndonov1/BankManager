package com.bank.dto;

import java.math.BigDecimal;

public record OverviewDto(
        PeriodDto period,
        BigDecimal aum,
        BigDecimal inflow,
        BigDecimal outflow,
        BigDecimal netFlow,
        int newAccounts,
        int activeCustomers,
        LoanKpi loans,
        RiskProxy riskProxy
) {

    public record PeriodDto(
            String from,
             String to)
    {}

    public record LoanKpi(
            int pending,
            int approved,
            int declined,
            double approvalRate,         // % от решените
            BigDecimal disbursedAmount,  // сума дисбурснати
            BigDecimal avgTicket,        // среден размер на дисбурснат заем
            int openPendingNow
    ) {}
    public record RiskProxy(
            double latePayers30dShare,
            double latePayers90dShare
    ) {}


}

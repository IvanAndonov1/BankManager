package com.bank.service;

import com.bank.dto.MonthlyForecastDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;

@Service
public class PredictiveAnalyticsService {

    private final Ollama ollama;
    private final AnalyticsService analyticsService;
    private final ObjectMapper mapper;

    public PredictiveAnalyticsService(Ollama ollama, AnalyticsService analyticsService) {
        this.ollama = ollama;
        this.analyticsService = analyticsService;
        this.mapper = new ObjectMapper()
                .registerModule(new JavaTimeModule());
    }

    private String buildMinimalHistoricalJson() {
        try {
            LocalDate from = LocalDate.now().minusDays(7);
            LocalDate to = LocalDate.now();

            var overview = analyticsService.overview(from, to);
            var loans = analyticsService.loanDecisionsDaily(from, to);
            var disbursed = analyticsService.disbursedDaily(from, to);

            int totalCreated = loans.stream().mapToInt(l -> l.created()).sum();
            int totalApproved = loans.stream().mapToInt(l -> l.approved()).sum();
            int totalDeclined = loans.stream().mapToInt(l -> l.declined()).sum();

            BigDecimal totalDisbursed = disbursed.stream()
                    .map(d -> d.disbursedAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            return mapper.writeValueAsString(new HashMap<>() {{
                put("aum", overview.aum());
                put("inflow", overview.inflow());
                put("outflow", overview.outflow());
                put("netFlow", overview.netFlow());
                put("loansCreated", totalCreated);
                put("loansApproved", totalApproved);
                put("loansDeclined", totalDeclined);
                put("disbursed", totalDisbursed);
            }});
        } catch (Exception e) {
            throw new RuntimeException("Error building minimal historical JSON", e);
        }
    }

    public MonthlyForecastDto forecast() {
        try {
            String historicalJson = buildMinimalHistoricalJson();

            String prompt = """
            You are a financial analyst AI.
            
            Here is summarized bank data from the last 7 days:
            %s
            
            Provide a 30-day FORECAST SUMMARY (not daily).
            Respond ONLY with valid JSON, no explanations.
            
            JSON schema:
            {
              "periodFrom": "YYYY-MM-DD",
              "periodTo": "YYYY-MM-DD",
              "inflow": 200000.00,
              "outflow": 5000.00,
              "net": 195000.00,
              "loansCreated": 25,
              "loansApproved": 15,
              "loansDeclined": 10,
              "disbursedAmount": 180000.00,
              "confidence": 0.87,
              "analysis": "MANDATORY: Write a concise but detailed analysis covering inflow, outflow, net flow, loans, approvals/declines, disbursements, risks and overall financial outlook."
            }
            
            Important:
            - Do NOT leave 'analysis' empty.
            - 'analysis' must be at least 3 sentences.
            """.formatted(historicalJson);


            String raw = ollama.generate("llama3.2:3b", prompt);

            System.out.println("=== RAW Ollama forecast output ===");
            System.out.println(raw);
            System.out.println("=================================");

            return mapper.readValue(raw, MonthlyForecastDto.class);
        } catch (Exception e) {
            throw new RuntimeException("Error generating forecast: " + e.getMessage(), e);
        }
    }
}

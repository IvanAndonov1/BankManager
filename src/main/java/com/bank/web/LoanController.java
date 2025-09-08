package com.bank.web;

import com.bank.dao.LoanApplicationDao;
import com.bank.dto.EvaluationResult;
import com.bank.dto.LoanApplicationDto;
import com.bank.service.CreditEvaluationService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanApplicationDao dao;
    private final CreditEvaluationService evaluator;

    public LoanController(LoanApplicationDao dao, CreditEvaluationService evaluator) {
        this.dao = dao;
        this.evaluator = evaluator;
    }

    /**
     * Create a new loan application.
     * Example payload:
     * {
     *   "customerId": 1,
     *   "productType": "CONSUMER",
     *   "requestedAmount": 5000,
     *   "termMonths": 24,
     *   "employerStartDate": "2024-01-01",
     *   "netSalary": 2500.00
     * }
     */
    @PostMapping("/applications")
    public Map<String, Object> create(@RequestBody Map<String, Object> body) {
        Long id = dao.create(
                Long.valueOf(body.get("customerId").toString()),
                (String) body.get("productType"),
                new BigDecimal(body.get("requestedAmount").toString()),
                Integer.parseInt(body.get("termMonths").toString()),
                LocalDate.parse(body.get("employerStartDate").toString()),
                new BigDecimal(body.get("netSalary").toString())
        );
        return Map.of("id", id);
    }

    @PostMapping("/applications/{id}/evaluate")
    public EvaluationResult evaluate(@PathVariable Long id) {
        return evaluator.evaluate(id);
    }

    @GetMapping("/{id}")
    public LoanApplicationDto get(@PathVariable Long id) {
        return dao.findById(id);
    }
}

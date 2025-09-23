package com.bank.web;

import com.bank.service.Ollama;
import com.bank.service.AiToolsService;
import com.bank.service.AccountService;
import com.bank.security.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/ai")
public class ApiController {

    private final Ollama ollama;
    private final AiToolsService tools;
    private final AccountService accountService;

    public ApiController(Ollama ollama, AiToolsService tools, AccountService accountService) {
        this.ollama = ollama;
        this.tools = tools;
        this.accountService = accountService;
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generate(@RequestBody Map<String, Object> body) {
        String model = body != null && body.get("model") != null ? String.valueOf(body.get("model")) : "llama3.2:3b";
        String prompt = body != null ? String.valueOf(body.get("prompt")) : null;
        if (prompt == null || prompt.equals("null") || prompt.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "ok", false,
                    "error", "Field 'prompt' is required"
            ));
        }
        String output = ollama.generate(model, prompt);
        return ResponseEntity.ok(Map.of(
                "ok", true,
                "model", model,
                "output", output
        ));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> body) {
        String prompt = body.get("prompt");
        if (prompt == null || prompt.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "ok", false,
                    "error", "Field 'prompt' is required"
            ));
        }

        Long customerId = SecurityUtil.currentUserId();
        if (customerId == null) {
            throw new AccessDeniedException("User not authenticated");
        }

        var accounts = accountService.findByCustomer(customerId);
        String accountNumber = accounts.isEmpty() ? null : accounts.get(0).accountNumber();

        String answer;
        switch (prompt.trim()) {
            case "1" -> {
                if (accountNumber != null) {
                    answer = tools.getBalance(accountNumber);
                } else {
                    answer = "No account found.";
                }
            }
            case "2" -> {
                if (accountNumber != null) {
                    answer = tools.getLastTransactions(accountNumber, 3);
                } else {
                    answer = "No account found.";
                }
            }
            case "3" -> answer = tools.getLoans(customerId);
            case "4" -> answer = tools.getCreditScore(customerId);
            case "5" -> answer = tools.getLoanApplications(customerId);
            case "6" -> answer = tools.getLatePayments(customerId);
            case "7" -> {
                if (SecurityUtil.isEmployeeOrAdmin()) {
                    answer = tools.getAnalyticsOverview();
                } else {
                    answer = "This option is only available for employees or admins.";
                }
            }
            case "8" -> answer = tools.getCards(customerId);
            case "9" -> answer = tools.getProfile(customerId);
            default -> answer = "I don’t understand the request. Do you want to connect to an employee?";
        }

        List<String> menu = List.of(
                "1. Show my account balances",
                "2. Show my last 3 transactions",
                "3. Show my active loans",
                "4. Show my credit score",
                "5. Show my loan applications",
                "6. Do I have late payments?",
                "7. Show bank overview (employees/admins only)",
                "8. Show my cards",
                "9. Show my profile"
        );

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "menu", menu,
                "response", answer
        ));
    }
}

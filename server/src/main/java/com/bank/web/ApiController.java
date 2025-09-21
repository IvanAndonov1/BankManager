package com.bank.web;

import com.bank.service.Ollama;
import com.bank.service.AiToolsService;
import com.bank.service.AccountService;
import com.bank.security.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            return ResponseEntity.status(403).body(Map.of(
                    "ok", false,
                    "error", "User not authenticated"
            ));
        }

        var accounts = accountService.findByCustomer(customerId);
        String accountNumber = accounts.isEmpty() ? null : accounts.get(0).accountNumber();

        int limit = 3;
        Matcher matcher = Pattern.compile("(\\d+)").matcher(prompt);
        if (matcher.find()) {
            limit = Integer.parseInt(matcher.group(1));
        }

        String answer;
        if (accountNumber != null && prompt.toLowerCase().contains("balance")) {
            answer = tools.getBalance(accountNumber);
        } else if (accountNumber != null && prompt.toLowerCase().contains("transaction")) {
            answer = tools.getLastTransactions(accountNumber, limit);
        } else if (prompt.toLowerCase().contains("loan")) {
            answer = tools.getLoans(customerId);
        }else if (prompt.toLowerCase().contains("credit score") || prompt.toLowerCase().contains("evaluation")) {
            answer = tools.getCreditScore(customerId);
        }
        else {
            answer = ollama.generate("llama3.2:3b", prompt);
        }

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "response", answer
        ));
    }
}

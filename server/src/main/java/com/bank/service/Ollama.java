package com.bank.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class Ollama {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl;

    public Ollama(@Value("${ollama.base-url:http://localhost:11434}") String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String generate(String model, String prompt) {
        if (prompt == null || prompt.isBlank()) {
            throw new IllegalArgumentException("prompt is required");
        }
        if (model == null || model.isBlank()) {
            model = "llama3.2:3b";
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", model);
        payload.put("prompt", prompt);
        payload.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> req = new HttpEntity<>(payload, headers);

        String url = baseUrl + "/api/generate";

        @SuppressWarnings("unchecked")
        Map<String, Object> result = restTemplate.postForObject(url, req, Map.class);

        if (result == null) {
            throw new IllegalStateException("Empty response from Ollama");
        }

        Object response = result.get("response");
        return response != null ? String.valueOf(response) : result.toString();
    }
}


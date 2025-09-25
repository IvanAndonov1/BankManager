package com.bank.web;

import com.bank.dto.MonthlyForecastDto;
import com.bank.service.PredictiveAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.bank.security.SecurityUtil.isEmployeeOrAdmin;

@RestController
@RequestMapping("/api/staff/analytics/ai")
public class PredictiveAnalyticsController {

    private final PredictiveAnalyticsService svc;

    public PredictiveAnalyticsController(PredictiveAnalyticsService svc) {
        this.svc = svc;
    }

    private void ensureStaff() {
        if (!isEmployeeOrAdmin()) {
            throw new RuntimeException("Forbidden");
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/forecast")
    public ResponseEntity<MonthlyForecastDto> forecast() {
        ensureStaff();
        return ResponseEntity.ok(svc.forecast());
    }
}

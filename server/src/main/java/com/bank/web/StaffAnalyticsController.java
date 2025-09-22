package com.bank.web;

import com.bank.dto.*;
import com.bank.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;

import static com.bank.security.SecurityUtil.isEmployeeOrAdmin;

@RestController
@RequestMapping("/api/staff/analytics")
public class StaffAnalyticsController {

    private final AnalyticsService svc;

    public StaffAnalyticsController(AnalyticsService svc) {
        this.svc = svc;
    }

    private void ensureStaff() throws AccessDeniedException {

        if (!isEmployeeOrAdmin()) {
            throw new AccessDeniedException("Forbidden");
        }

    }

    @GetMapping("/overview")
    public OverviewDto overview(@RequestParam(required = false) String from,
                                @RequestParam(required = false) String to) throws AccessDeniedException {

        ensureStaff();
        LocalDate f = (from == null || from.isBlank()) ? null : LocalDate.parse(from);
        LocalDate t = (to   == null || to.isBlank())   ? null : LocalDate.parse(to);

        return svc.overview(f, t);

    }

    @GetMapping("/cashflow/daily")
    public List<CashflowPointDto> cashflowDaily(@RequestParam(required = false) String from,
                                                @RequestParam(required = false) String to) throws AccessDeniedException {

        ensureStaff();
        LocalDate f = (from == null || from.isBlank()) ? null : LocalDate.parse(from);
        LocalDate t = (to   == null || to.isBlank())   ? null : LocalDate.parse(to);

        return svc.cashflowDaily(f, t);

    }

    @GetMapping("/loans/decisions/daily")
    public List<LoanDecisionsPointDto> loanDecisionsDaily(@RequestParam(required = false) String from,
                                                          @RequestParam(required = false) String to) throws AccessDeniedException {

        ensureStaff();
        LocalDate f = (from == null || from.isBlank()) ? null : LocalDate.parse(from);
        LocalDate t = (to   == null || to.isBlank())   ? null : LocalDate.parse(to);

        return svc.loanDecisionsDaily(f, t);

    }

    @GetMapping("/loans/disbursed/daily")
    public List<DisbursedPointDto> disbursedDaily(@RequestParam(required = false) String from,
                                                  @RequestParam(required = false) String to) throws AccessDeniedException {

        ensureStaff();
        LocalDate f = (from == null || from.isBlank()) ? null : LocalDate.parse(from);
        LocalDate t = (to   == null || to.isBlank())   ? null : LocalDate.parse(to);

        return svc.disbursedDaily(f, t);

    }

    @GetMapping("/declines/top")
    public List<KeyValueCountDto> topDeclines(@RequestParam(required = false) String from,
                                              @RequestParam(required = false) String to,
                                              @RequestParam(required = false, defaultValue = "10") Integer limit) throws AccessDeniedException {

        ensureStaff();
        LocalDate f = (from == null || from.isBlank()) ? null : LocalDate.parse(from);
        LocalDate t = (to   == null || to.isBlank())   ? null : LocalDate.parse(to);

        return svc.topDeclineReasons(f, t, limit);

    }

}

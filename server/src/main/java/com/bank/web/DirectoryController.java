package com.bank.web;

import com.bank.dao.UserDirectoryDao;
import com.bank.dto.EvaluationBreakdown;
import com.bank.service.LoanDecisionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static com.bank.security.SecurityUtil.*;

@RestController
@RequestMapping("/api")
public class DirectoryController {

    private final UserDirectoryDao dao;

    public DirectoryController(UserDirectoryDao dao) {
        this.dao = dao;
    }

    @GetMapping("/customers/all")
    public List<Map<String, Object>> customersAll(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "20") int size,
                                                  @RequestParam(required = false) String query,
                                                  @RequestParam(required = false) Boolean active) {
        if (!isEmployeeOrAdmin()) {
            throw new AccessDeniedException("Forbidden");
        }
        return dao.listCustomers(page, size, query, active);
    }

    @GetMapping("/employees/all")
    public List<Map<String, Object>> employeesAll(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "20") int size,
                                                  @RequestParam(required = false) String query,
                                                  @RequestParam(required = false) Boolean active) {
        if (!isEmployeeOrAdmin()) {
            throw new AccessDeniedException("Forbidden");
        }
        return dao.listEmployees(page, size, query, active);
    }



}

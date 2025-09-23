package com.bank.web;

import com.bank.dao.LoanApplicationDao;
import com.bank.dao.UserDirectoryDao;
import com.bank.dto.EvaluationBreakdown;
import com.bank.dto.UpdateCustomerRequestDto;
import com.bank.dto.UpdateCustomerResponseDto;
import com.bank.service.CreditEvaluationService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.bank.security.SecurityUtil.isEmployeeOrAdmin;

@RestController
@RequestMapping("/api/customers")
public class StaffCustomersController {

    private final UserDirectoryDao directoryDao;
    private final LoanApplicationDao loanApplicationDao;

    public StaffCustomersController(UserDirectoryDao directoryDao, LoanApplicationDao loanApplicationDao){
        this.directoryDao = directoryDao;
        this.loanApplicationDao = loanApplicationDao;
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateCustomerByStaff(@PathVariable Long id, @RequestBody UpdateCustomerRequestDto req){

        if(!isEmployeeOrAdmin()){
            throw new AccessDeniedException("Forbidden!");
        }

        if (req.email() != null && !req.email().contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email"));
        }

        if (req.phoneNumber() != null && req.phoneNumber().length() > 30) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid phoneNumber"));
        }

        try {

            int n = directoryDao.updateCustomerByStaff(id, req);

            if (n == 0) {
                return ResponseEntity.ok(directoryDao.readCustomerForResponse(id));
            }

            UpdateCustomerResponseDto out = directoryDao.readCustomerForResponse(id);
            return (out == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(out);

        } catch (EmptyResultDataAccessException notFound) {
            return ResponseEntity.status(404).body(Map.of("error", "Customer not found"));
        } catch (DataIntegrityViolationException dup) {
            return ResponseEntity.status(409).body(Map.of("error", "Duplicate or invalid data"));
        }
    }

    @GetMapping("/credits")
    public ResponseEntity<?> listApprovedCredits(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset
    ) {

        if (!isEmployeeOrAdmin()) {
            throw new AccessDeniedException("Forbidden!");
        }

        var rows = loanApplicationDao.findForStaffBasics(limit, offset, "APPROVED", customerId);

        return ResponseEntity.ok(rows);
    }

}



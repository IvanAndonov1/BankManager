package com.bank.web;

import com.bank.dao.UserDirectoryDao;
import com.bank.dto.CustomerDto;
import com.bank.dto.EmployeeDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.bank.security.SecurityUtil.*;

@RestController
@RequestMapping("/api")
public class DirectoryController {

    private final UserDirectoryDao dao;

    public DirectoryController(UserDirectoryDao dao) {
        this.dao = dao;
    }

    @GetMapping("/customers/all")
    public List<CustomerDto> customersAll(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "20") int size,
                                                  @RequestParam(required = false) String query,
                                                  @RequestParam(required = false) Boolean active) {
        if (!isEmployeeOrAdmin()) {
            throw new AccessDeniedException("Forbidden");
        }

        return dao.listCustomersDetailed(page, size, query, active);

    }

    @GetMapping("/employees/all")
    public List<EmployeeDto> employeesAll(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "20") int size,
                                          @RequestParam(required = false) String query,
                                          @RequestParam(required = false) Boolean active) {

        if (!isAdmin()) {
            throw new AccessDeniedException("Forbidden");
        }

        return dao.listEmployeesDetailed(page, size, query, active);

    }

    @GetMapping("/customers/by-id/{id}")
    public ResponseEntity<CustomerDto> getCustomerById(@PathVariable Long id) {

        if (!isEmployeeOrAdmin()) {
            throw new AccessDeniedException("Forbidden!");
        }

        CustomerDto dto = dao.findCustomerById(id);

        return (dto == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);

    }

    @GetMapping("/employees/by-id/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {

        if (!isAdmin()) {
            throw new AccessDeniedException("Forbidden!");
        }

        EmployeeDto dto = dao.findEmployeeById(id);

        return (dto == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);

    }

    @GetMapping("/customers/by-username/{username}")
    public ResponseEntity<CustomerDto> getCustomerByUsername(@PathVariable String username) {

        if (!isEmployeeOrAdmin()) {
            throw new AccessDeniedException("Forbidden!");
        }

        CustomerDto dto = dao.findCustomerByUsername(username);

        return (dto == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);

    }

    @GetMapping("/employees/by-username/{username}")
    public ResponseEntity<EmployeeDto> getEmployeeByUsername(@PathVariable String username) {

        if (!isAdmin()) {
            throw new AccessDeniedException("Forbidden!");
        }

        EmployeeDto dto = dao.findEmployeeByUsername(username);

        return (dto == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(dto);

    }

}

package com.bank.web;

import com.bank.dao.UserDirectoryDao;
import com.bank.dto.UserListItemDto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DirectoryController {

    private final UserDirectoryDao dao;

    public DirectoryController(UserDirectoryDao dao) {
        this.dao = dao;
    }

    // EMPLOYEE view -> list customers (one endpoint, params optional)
    @GetMapping("/customers/all")
    public List<UserListItemDto> customersAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Boolean active
    ) {
        return dao.listByRolePaged("CUSTOMER", page, size, query, active);
    }

    // ADMIN view -> list employees (one endpoint, params optional)
    @GetMapping("/employees/all")
    public List<UserListItemDto> employeesAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false, name = "query") String q,
            @RequestParam(required = false) Boolean active
    ) {
        return dao.listByRolePaged("EMPLOYEE", page, size, q, active);
    }
}

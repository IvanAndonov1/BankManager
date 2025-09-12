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

    // За employee страницата: списък клиенти
    @GetMapping("/customers/all")
    public List<UserListItemDto> customersAll() {
        return dao.listByRole("CUSTOMER");
    }

    // За admin страницата: списък служители
    @GetMapping("/employees/all")
    public List<UserListItemDto> employeesAll() {
        return dao.listByRole("EMPLOYEE");
    }
}

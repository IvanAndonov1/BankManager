package com.bank.models;

import com.bank.enums.Role;

public class Employee extends User{

    // can have account (сметка) in the bank

    public Employee(String name, String password, String firstName, String lastName, String email) {

        super(name, password, firstName, lastName, email);
        this.setRole(Role.EMPLOYEE);

    }

}

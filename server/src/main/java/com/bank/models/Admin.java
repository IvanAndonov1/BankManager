package com.bank.models;

import com.bank.enums.Role;

public class Admin extends User {

    public Admin(String name, String password, String firstName, String lastName, String email) {

        super(name, password, firstName, lastName, email);
        this.setRole(Role.ADMIN);

    }

    //...

}

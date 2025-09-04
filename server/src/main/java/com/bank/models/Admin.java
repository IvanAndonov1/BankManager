package com.bank.models;

import com.bank.enums.Role;

public class Admin extends User {

    public Admin(String username, String password, String firstName, String lastName, String email) {

        super(username, password, firstName, lastName, email);
        this.setRole(Role.ADMIN);

    }

    //...

}

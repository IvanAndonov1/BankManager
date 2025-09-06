package com.bank.models;

import com.bank.enums.Role;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Customer extends User{

    private List<Account> accountList = new ArrayList<>();

    public Customer(String username, String password, String firstName, String lastName, String email){

        super(username, password, firstName, lastName, email);
        this.setRole(Role.CUSTOMER);

    }

    // to be transfered to the service layer

//    public void addAccount (Account account){
//        accountList.add(account);
//    }
//
//    public List<Account> getAccountList(){
//        return accountList;
//    }

}

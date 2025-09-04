package com.bank.models;

import com.bank.enums.TransactionType;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

// сметка
public class Account {

    private UUID id;
    private String accountNumber;
    private BigDecimal balance;
    private UUID ownerId;

    private List<Transaction> transactionList;

    public Account(){

        // accountNumber ???
        this.balance = BigDecimal.ZERO;

    }

    public String getAccountNumber(){
        return accountNumber;
    }

    public BigDecimal getBalance(){
        return balance;
    }

    // will be transferred to the service layer

//    public void deposit(BigDecimal amount){
//
//        if(amount.compareTo(BigDecimal.ZERO) > 0) {
//
//            balance = balance.add(amount);
//            transactionList.add(new Transaction(TransactionType.DEPOSIT, amount, "Deposit to account" + accountNumber));
//
//        }
//
//    }
//
//    public boolean withdraw (BigDecimal amount){
//
//        if(amount.compareTo(BigDecimal.ZERO) > 0 && balance.compareTo(amount) >= 0){
//
//            balance = balance.subtract(amount);
//           transactionList.add(new Transaction(TransactionType.WITHDRAW, amount, "Withdraw from account " + accountNumber));
//
//        }
//
//        return false;
//
//    }
//
//    public void transferTo(Account target, BigDecimal amount){
//
//        if(withdraw(amount)){
//
//            target.deposit(amount);
//            transactionList.add(new Transaction(TransactionType.TRANSFER, amount, "Transfer to account " + target.getAccountNumber()));
//        }
//
//    }

}

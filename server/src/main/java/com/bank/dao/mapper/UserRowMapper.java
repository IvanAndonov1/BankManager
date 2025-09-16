package com.bank.dao.mapper;

import com.bank.enums.Role;
import com.bank.models.Admin;
import com.bank.models.Customer;
import com.bank.models.Employee;
import com.bank.models.User;
import org.springframework.jdbc.core.RowMapper;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;

public class UserRowMapper implements RowMapper<User> {

    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {

        Role role = Role.valueOf(rs.getString("role"));

        String username = rs.getString("username");
        String password = rs.getString("password");
        String first = rs.getString("first_name");
        String last = rs.getString("last_name");
        String email = rs.getString("email");

        Date dobSql = rs.getDate("date_of_birth");
        var dob = (dobSql != null ? dobSql.toLocalDate() : null);

        String phone = rs.getString("phone_number");
        String address = rs.getString("home_address");
        String egn = rs.getString("egn");

        User u;

        switch (role){

            case CUSTOMER->{

                Customer c = new Customer(username, password, first, last, email);
                c.setId(rs.getLong("id"));

                try{
                    c.setCreatedAt(rs.getObject("created_at", OffsetDateTime.class));
                } catch (Throwable ignored){}

                u = c;

            }
            case EMPLOYEE -> u = new Employee(username, password, first, last, email);
            case ADMIN -> u = new Admin(username, password, first, last, email);
            default -> throw new IllegalArgumentException("Unknown role: " + role);
        }

        u.setRole(role);
        u.setDateOfBirth(dob);
        u.setPhoneNumber(phone);
        u.setEgn(egn);
        u.setHomeAddress(address);

        return u;

    }
}

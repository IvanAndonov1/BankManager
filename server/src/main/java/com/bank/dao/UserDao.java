package com.bank.dao;

import com.bank.dao.mapper.UserRowMapper;
import com.bank.models.User;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserDao {

    private final NamedParameterJdbcTemplate jdbc;
    private final UserRowMapper mapper = new UserRowMapper();

    public UserDao(NamedParameterJdbcTemplate jdbc){
        this.jdbc = jdbc;
    }

    public Optional<User> findById (Long id) {

        String sql = """
            SELECT
                u.id,
                u.name AS username,
                u.password,
                u.first_name,
                u.last_name,
                u.email,
                u.role,
                u.created_at,
                u.active,
                u.date_of_birth,
                u.phone_number,
                u.home_address,
                u.egn
            FROM users u
            WHERE u.id = :id
            LIMIT 1
        """;
        return jdbc.query(sql, new MapSqlParameterSource("id", id), mapper).stream().findFirst();
    }
}

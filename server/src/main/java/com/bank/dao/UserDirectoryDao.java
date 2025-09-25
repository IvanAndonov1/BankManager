package com.bank.dao;

import com.bank.dto.*;
import com.bank.models.Customer;
import com.bank.models.User;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Repository
public class UserDirectoryDao {

    private final NamedParameterJdbcTemplate jdbc;

    public UserDirectoryDao(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public CustomerDto findCustomerById(Long id) {

        String sql = """
                    SELECT u.id, u.name AS username, u.first_name, u.last_name, u.email,
                    u.date_of_birth, u.phone_number, u.home_address, u.egn,
                    u.role, u.active, u.created_at,
                    a.id AS account_id, a.account_number, a.balance
                    FROM users u
                    INNER JOIN customers c ON c.id = u.id
                    LEFT JOIN accounts a ON a.customer_id = u.id
                    WHERE u.id = :id AND u.role = 'CUSTOMER'
                    ORDER BY a.id
                """;

        var rows = jdbc.queryForList(sql, new MapSqlParameterSource("id", id));
        return buildSingleCustomerDto(rows);

    }

    public CustomerDto findCustomerByUsername(String username) {

        String sql = """
                    SELECT u.id, u.name AS username, u.first_name, u.last_name, u.email,
                    u.date_of_birth, u.phone_number, u.home_address, u.egn,
                    u.role, u.active, u.created_at,
                    a.id AS account_id, a.account_number, a.balance
                    FROM users u
                    INNER JOIN customers c ON c.id = u.id
                    LEFT JOIN accounts a ON a.customer_id = u.id
                    WHERE u.name = :uname AND u.role = 'CUSTOMER'
                    ORDER BY a.id
                """;

        var rows = jdbc.queryForList(sql, new MapSqlParameterSource("uname", username));
        return buildSingleCustomerDto(rows);

    }

    public EmployeeDto findEmployeeById(Long id) {

        String sql = """
                    SELECT u.id, u.name AS username, u.first_name, u.last_name, u.email,
                    u.date_of_birth, u.phone_number, u.home_address, u.egn,
                    u.role, u.active, u.created_at
                    FROM users u
                    WHERE u.id = :id AND u.role = 'EMPLOYEE'
                """;

        var list = jdbc.queryForList(sql, new MapSqlParameterSource("id", id));
        return list.isEmpty() ? null : mapRowToEmployee(list.get(0));

    }

    public EmployeeDto findEmployeeByUsername(String username) {

        String sql = """
                    SELECT u.id, u.name AS username, u.first_name, u.last_name, u.email,
                    u.date_of_birth, u.phone_number, u.home_address, u.egn,
                    u.role, u.active, u.created_at
                    FROM users u
                    WHERE u.name = :uname AND u.role = 'EMPLOYEE'
                """;

        var list = jdbc.queryForList(sql, new MapSqlParameterSource("uname", username));
        return list.isEmpty() ? null : mapRowToEmployee(list.get(0));

    }

    public List<CustomerDto> listCustomersDetailed(String query, Boolean active) {

        boolean qFilter = (query != null && !query.isBlank());

        String qLike = qFilter ? "%" + query + "%" : null;

        String sql = """
                SELECT u.id, u.name AS username, u.first_name, u.last_name, u.email,
                       u.date_of_birth, u.phone_number, u.home_address, u.egn,
                       u.role, u.active, u.created_at,
                       a.id AS account_id, a.account_number, a.balance
                FROM users u
                INNER JOIN customers c ON c.id = u.id
                LEFT JOIN accounts a ON a.customer_id = u.id
                WHERE u.role = 'CUSTOMER'
                  AND ( :activeFilter = false OR u.active = :active )
                  AND ( :qFilter = false OR u.name ILIKE :qLike OR u.email ILIKE :qLike )
                ORDER BY u.created_at DESC, u.id DESC, a.id
                """;

        var p = new MapSqlParameterSource()
                .addValue("activeFilter", active != null)
                .addValue("active", active)
                .addValue("qFilter", qFilter)
                .addValue("qLike", qLike);

        List<Map<String, Object>> rows = jdbc.queryForList(sql, p);
        return groupRowsToCustomers(rows);

    }

    public List<EmployeeDto> listEmployeesDetailed(String query, Boolean active) {

        boolean qFilter = (query != null && !query.isBlank());

        String qLike = qFilter ? "%" + query + "%" : null;

        String sql = """
                SELECT u.id, u.name AS username, u.first_name, u.last_name, u.email,
                       u.date_of_birth, u.phone_number, u.home_address, u.egn,
                       u.role, u.active, u.created_at
                FROM users u
                WHERE u.role = 'EMPLOYEE'
                  AND ( :activeFilter = false OR u.active = :active )
                  AND ( :qFilter = false OR u.name ILIKE :qLike OR u.email ILIKE :qLike )
                ORDER BY u.created_at DESC, u.id DESC
                """;

        var p = new MapSqlParameterSource()
                .addValue("activeFilter", active != null)
                .addValue("active", active)
                .addValue("qFilter", qFilter)
                .addValue("qLike", qLike);

        var rows = jdbc.queryForList(sql, p);
        List<EmployeeDto> out = new ArrayList<>();

        for (Map<String, Object> r : rows) {
            out.add(mapRowToEmployee(r));
        }

        return out;

    }

    private CustomerDto buildSingleCustomerDto(List<Map<String, Object>> rows) {

        if (rows == null || rows.isEmpty()) {
            return null;
        }

        Map<String, Object> first = rows.get(0);

        Long id = getLong(first, "id");
        String username = getStr(first, "username");
        String firstName = getStr(first, "first_name");
        String lastName = getStr(first, "last_name");
        String email = getStr(first, "email");
        var dob = getLocalDate(first, "date_of_birth");
        String phone = getStr(first, "phone_number");
        String address = getStr(first, "home_address");
        String egn = getStr(first, "egn");
        String role = getStr(first, "role");
        boolean active = getBool(first, "active");
        OffsetDateTime createdAt = getOffset(first, "created_at");

        List<AccountDto> accounts = new ArrayList<>();

        for (Map<String, Object> r : rows) {

            Long accId = getLong(r, "account_id");

            if (accId != null) {

                String accNo = getStr(r, "account_number");
                BigDecimal bal = getBigDec(r, "balance");
                accounts.add(new AccountDto(accNo, bal));

            }
        }

        return new CustomerDto(
                id, username, firstName, lastName, email, dob, phone, address, egn,
                role, active, createdAt, accounts
        );
    }

    private List<CustomerDto> groupRowsToCustomers(List<Map<String, Object>> rows) {

        Map<Long, Aggregator> byId = new LinkedHashMap<>();

        for (Map<String, Object> r : rows) {

            Long uid = getLong(r, "id");
            Aggregator agg = byId.computeIfAbsent(uid, k -> new Aggregator(r));
            agg.addAccount(r);

        }

        List<CustomerDto> out = new ArrayList<>(byId.size());
        for (Aggregator a : byId.values()) out.add(a.toDto());
        return out;

    }

    private EmployeeDto mapRowToEmployee(Map<String, Object> r) {

        return new EmployeeDto(
                getLong(r, "id"),
                getStr(r, "username"),
                getStr(r, "first_name"),
                getStr(r, "last_name"),
                getStr(r, "email"),
                getLocalDate(r, "date_of_birth"),
                getStr(r, "phone_number"),
                getStr(r, "home_address"),
                getStr(r, "egn"),
                getStr(r, "role"),
                getBool(r, "active"),
                getOffset(r, "created_at")
        );

    }

    private static class Aggregator {

        final Long id;
        final String username;
        final String firstName;
        final String lastName;
        final String email;
        final LocalDate dob;
        final String phone;
        final String address;
        final String egn;
        final String role;
        final boolean active;
        final OffsetDateTime createdAt;
        final List<AccountDto> accounts = new ArrayList<>();

        Aggregator(Map<String, Object> r) {

            this.id = getLong(r, "id");
            this.username = getStr(r, "username");
            this.firstName = getStr(r, "first_name");
            this.lastName = getStr(r, "last_name");
            this.email = getStr(r, "email");
            this.dob = getLocalDate(r, "date_of_birth");
            this.phone = getStr(r, "phone_number");
            this.address = getStr(r, "home_address");
            this.egn = getStr(r, "egn");
            this.role = getStr(r, "role");
            this.active = getBool(r, "active");
            this.createdAt = getOffset(r, "created_at");

        }

        void addAccount(Map<String, Object> r) {

            Long accId = getLong(r, "account_id");

            if (accId != null) {

                String accNo = getStr(r, "account_number");
                BigDecimal bal = getBigDec(r, "balance");
                accounts.add(new AccountDto(accNo, bal));

            }

        }

        CustomerDto toDto() {

            return new CustomerDto(
                    id, username, firstName, lastName, email, dob, phone, address, egn,
                    role, active, createdAt, accounts
            );

        }
    }

    private static Long getLong(Map<String, Object> r, String k) {

        Object v = r.get(k);

        if (v instanceof Number n) {
            return n.longValue();
        }

        if (v instanceof String s) try {
            return Long.parseLong(s);
        } catch (Exception ignored) {
        }

        return null;

    }

    private static String getStr(Map<String, Object> r, String k) {

        Object v = r.get(k);
        return v == null ? null : v.toString();

    }

    private static boolean getBool(Map<String, Object> r, String k) {

        Object v = r.get(k);
        if (v instanceof Boolean b) return b;
        if (v instanceof Number n) return n.intValue() != 0;
        if (v instanceof String s) return Boolean.parseBoolean(s);
        return false;

    }

    private static OffsetDateTime getOffset(Map<String, Object> r, String k) {

        try {

            Object v = r.get(k);
            if (v instanceof OffsetDateTime odt) return odt;
            if (v instanceof Timestamp ts) return ts.toInstant().atOffset(ZoneOffset.UTC);
        } catch (Throwable ignored) {
        }

        return null;
    }

    private static BigDecimal getBigDec(Map<String, Object> r, String k) {

        Object v = r.get(k);
        if (v instanceof BigDecimal bd) return bd;
        if (v instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        if (v instanceof String s) try {
            return new BigDecimal(s);
        } catch (Exception ignored) {
        }
        return BigDecimal.ZERO;

    }

    private static LocalDate getLocalDate(Map<String, Object> r, String k) {

        Object v = r.get(k);
        if (v instanceof LocalDate ld) return ld;
        if (v instanceof java.sql.Date sd) return sd.toLocalDate();
        if (v instanceof Date ud)
            return ud.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();

        if (v instanceof String s) {
            try {
                return LocalDate.parse(s);
            } catch (Exception ignored) {
            }
        }

        return null;
    }

    public int updateCustomerByStaff(Long id, UpdateCustomerRequestDto req) {

        Integer exists = jdbc.queryForObject(
                "SELECT COUNT(*) FROM users WHERE id=:id AND role='CUSTOMER'",
                new MapSqlParameterSource("id", id),
                Integer.class
        );

        if (exists == null || exists == 0) {
            throw new EmptyResultDataAccessException("Customer not found", 1);
        }

        StringBuilder sql = new StringBuilder("UPDATE users SET ");
        MapSqlParameterSource p = new MapSqlParameterSource().addValue("id", id);

        int sets = 0;

        if (req.firstName() != null) {
            sql.append("first_name=:first_name, ");
            p.addValue("first_name", req.firstName());
            sets++;
        }

        if (req.lastName() != null) {
            sql.append("last_name=:last_name, ");
            p.addValue("last_name", req.lastName());
            sets++;
        }

        if (req.email() != null) {
            sql.append("email=:email, ");
            p.addValue("email", req.email());
            sets++;
        }

        if (req.phoneNumber() != null) {
            sql.append("phone_number=:phone, ");
            p.addValue("phone", req.phoneNumber());
            sets++;
        }

        if (req.homeAddress() != null) {
            sql.append("home_address=:addr, ");
            p.addValue("addr", req.homeAddress());
            sets++;
        }

        if (req.active() != null) {
            sql.append("active=:active, ");
            p.addValue("active", req.active());
            sets++;
        }

        if (sets == 0) {
            return 0;
        }

        sql.setLength(sql.length() - 2);
        sql.append(" WHERE id=:id");

        return jdbc.update(sql.toString(), p);

    }

    public int updateEmployeeByAdmin(Long id, UpdateEmployeeRequestDto req) {

        Integer exists = jdbc.queryForObject(
                "SELECT COUNT(*) FROM users WHERE id=:id AND role='EMPLOYEE'",
                new MapSqlParameterSource("id", id),
                Integer.class
        );

        if (exists == null || exists == 0) {
            throw new EmptyResultDataAccessException("Employee not found", 1);
        }

        StringBuilder sql = new StringBuilder("UPDATE users SET ");
        MapSqlParameterSource p = new MapSqlParameterSource().addValue("id", id);
        int sets = 0;

        if (req.firstName() != null) {
            sql.append("first_name=:first_name, ");
            p.addValue("first_name", req.firstName());
            sets++;
        }
        if (req.lastName() != null) {
            sql.append("last_name=:last_name, ");
            p.addValue("last_name", req.lastName());
            sets++;
        }
        if (req.email() != null) {
            sql.append("email=:email, ");
            p.addValue("email", req.email());
            sets++;
        }
        if (req.phoneNumber() != null) {
            sql.append("phone_number=:phone, ");
            p.addValue("phone", req.phoneNumber());
            sets++;
        }
        if (req.homeAddress() != null) {
            sql.append("home_address=:addr, ");
            p.addValue("addr", req.homeAddress());
            sets++;
        }
        if (req.active() != null) {
            sql.append("active=:active, ");
            p.addValue("active", req.active());
            sets++;
        }

        if (sets == 0) return 0;
        sql.setLength(sql.length() - 2);
        sql.append(" WHERE id=:id");

        return jdbc.update(sql.toString(), p);

    }

    public EmployeeDto readEmployeeForResponse(Long id) {

            var p = new MapSqlParameterSource("id", id);

            var rows = jdbc.queryForList("""
        SELECT u.id, u.name AS username, u.first_name, u.last_name, u.email,
               u.date_of_birth, u.phone_number, u.home_address, u.egn,
               u.role, u.active, u.created_at
        FROM users u
        WHERE u.id = :id AND u.role = 'EMPLOYEE'
        """, p);

            if (rows.isEmpty()) {
                return null;
            }

            return mapRowToEmployee(rows.get(0));

    }

    public UpdateCustomerResponseDto readCustomerForResponse(Long id) {

        String sql = """
                    SELECT id, name AS username, first_name, last_name, email,
                    date_of_birth, phone_number, home_address, egn,
                    role, active, created_at
                    FROM users
                    WHERE id=:id AND role='CUSTOMER'
                """;

        return jdbc.query(sql, new MapSqlParameterSource("id", id), rs -> {

            if (!rs.next()) {
                return null;
            }

            return new UpdateCustomerResponseDto(
                    rs.getLong("id"),
                    rs.getString("username"),
                    rs.getString("first_name"),
                    rs.getString("last_name"),
                    rs.getString("email"),
                    rs.getObject("date_of_birth", LocalDate.class),
                    rs.getString("phone_number"),
                    rs.getString("home_address"),
                    rs.getString("egn"),
                    rs.getString("role"),
                    rs.getBoolean("active"),
                    rs.getObject("created_at", OffsetDateTime.class)
            );
        });

    }

    public int deactivateEmployee(Long id) {

        String sql = """
        UPDATE users
        SET active = FALSE, updated_at = now()
        WHERE id = :id
          AND "role" = 'EMPLOYEE'
          AND active = TRUE
    """;

        return jdbc.update(sql, new MapSqlParameterSource("id", id));

    }

    public int updateCustomerSelf(String username, UpdateCustomerSelfRequest req){

        Integer exists = jdbc.queryForObject(
                "SELECT COUNT(*) FROM users WHERE name=:name AND role='CUSTOMER'",
                new MapSqlParameterSource("name", username),
                Integer.class
        );

        if (exists == null || exists == 0) {
            throw new EmptyResultDataAccessException("Customer not found", 1);
        }

        StringBuilder sql = new StringBuilder("UPDATE users SET ");

        MapSqlParameterSource p = new MapSqlParameterSource().addValue("name", username);

        int sets = 0;

        if (req.firstName()   != null) { sql.append("first_name=:first_name, ");   p.addValue("first_name", req.firstName());   sets++; }
        if (req.lastName()    != null) { sql.append("last_name=:last_name, ");     p.addValue("last_name",  req.lastName());    sets++; }
        if (req.email()       != null) { sql.append("email=:email, ");             p.addValue("email",      req.email());       sets++; }
        if (req.phoneNumber() != null) { sql.append("phone_number=:phone, ");      p.addValue("phone",      req.phoneNumber()); sets++; }
        if (req.homeAddress() != null) { sql.append("home_address=:addr, ");       p.addValue("addr",       req.homeAddress()); sets++; }

        if (sets == 0) {
            return 0;
        }

        sql.setLength(sql.length() - 2);
        sql.append(" WHERE name=:name AND role='CUSTOMER'");

        return jdbc.update(sql.toString(), p);

    }

    public UpdateCustomerResponseDto readCustomerForResponseByUsername(String username) {

        var p = new MapSqlParameterSource("name", username);

        Long id = jdbc.queryForObject(
                "SELECT id FROM users WHERE name = :name AND role = 'CUSTOMER'",
                p,
                Long.class
        );

        if (id == null) {
            return null;
        }

        return readCustomerForResponse(id);

    }

    public int promoteEmployeeToAdmin(Long id) {

        String sql = """
        UPDATE users
        SET "role" = 'ADMIN',
            updated_at = now()
        WHERE id = :id
          AND "role" = 'EMPLOYEE'
          AND active = TRUE
        """;

        return jdbc.update(sql, new MapSqlParameterSource("id", id));

    }
    public Map<String, Object> readUserStatus(Long id){

        String sql = "SELECT id, name AS username, role, active FROM users WHERE id = :id";

        return jdbc.queryForMap(sql, new MapSqlParameterSource("id", id));

    }

    public int updatePassword(Long userId, String hashedPassword) {

        String sql = "UPDATE users SET password = :pwd, updated_at = now() WHERE id = :id";

        return jdbc.update(sql, new MapSqlParameterSource()
                .addValue("pwd", hashedPassword)
                .addValue("id", userId));

    }

    public Customer findCustomerByEmail(String email) {

        String sql = """
        SELECT id, name, password, first_name, last_name, email, created_at
        FROM users
        WHERE email = :email AND role = 'CUSTOMER'
    """;

        return jdbc.query(sql,
                new MapSqlParameterSource("email", email),
                rs -> {
                    if (rs.next()) {
                        return new Customer(
                                rs.getLong("id"),
                                rs.getString("name"),
                                rs.getString("password"),
                                rs.getString("first_name"),
                                rs.getString("last_name"),
                                rs.getString("email"),
                                rs.getObject("created_at", OffsetDateTime.class)
                        );
                    }
                    return null;
                });
    }

}


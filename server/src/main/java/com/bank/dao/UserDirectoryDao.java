package com.bank.dao;

import com.bank.dto.UserListItemDto;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Repository
public class UserDirectoryDao {

    private final NamedParameterJdbcTemplate jdbc;

    public UserDirectoryDao(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<UserListItemDto> MAPPER = (ResultSet rs, int i) -> {
        OffsetDateTime created = null;
        try {
            created = rs.getObject("created_at", OffsetDateTime.class);
        } catch (Throwable ignored) {

        }
        if (created == null) {
            Timestamp ts = rs.getTimestamp("created_at");
            if (ts != null) {
                created = ts.toInstant().atOffset(ZoneOffset.UTC);
            }
        }

        Integer accounts = null;
        Object accObj = rs.getObject("accounts");
        if (accObj != null) {
            if (accObj instanceof Number n) {
                accounts = n.intValue();
            } else {
                try { accounts = Integer.valueOf(accObj.toString()); } catch (Exception ignored) {}
            }
        }

        return new UserListItemDto(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("role"),
                created,
                rs.getBoolean("active"),
                accounts
        );
    };

    public List<UserListItemDto> listByRole(String role) {
        String sql = """
            SELECT u.id, u.name, u.email, u.role, u.created_at, u.active,
                   CASE WHEN :role = 'CUSTOMER' THEN COALESCE(acc.cnt, 0) ELSE NULL END AS accounts
            FROM users u
            LEFT JOIN (
                SELECT c.id AS cid, COUNT(a.id) AS cnt
                FROM customers c
                LEFT JOIN accounts a ON a.customer_id = c.id
                GROUP BY c.id
            ) acc ON (u.id = acc.cid)
            WHERE u.role = :role
            ORDER BY u.created_at DESC, u.id DESC
        """;
        var params = new MapSqlParameterSource("role", role);
        return jdbc.query(sql, params, MAPPER);
    }
    public List<UserListItemDto> listByRolePaged(String role, int page, int size, String q, Boolean active) {
        int safeSize = Math.max(size, 1);
        int safePage = Math.max(page, 0);
        int offset = safePage * safeSize;

        String sql = """
        SELECT u.id, u.name, u.email, u.role, u.created_at, u.active,
               COALESCE(acc.cnt, 0) AS accounts
        FROM users u
        LEFT JOIN (
            SELECT c.id AS cid, COUNT(a.id) AS cnt
            FROM customers c
            LEFT JOIN accounts a ON a.customer_id = c.id
            GROUP BY c.id
        ) acc ON (u.id = acc.cid)
        WHERE u.role = :role
          AND ( :activeFilter = false OR u.active = :active )
          AND ( :qFilter = false OR u.name ILIKE :qLike OR u.email ILIKE :qLike )
        ORDER BY u.created_at DESC, u.id DESC
        LIMIT :size OFFSET :offset
    """;

        boolean activeFilter = active != null;
        boolean qFilter = (q != null && !q.isBlank());
        String qLike = qFilter ? "%" + q + "%" : null;

        var params = new MapSqlParameterSource()
                .addValue("role", role)
                .addValue("activeFilter", activeFilter)
                .addValue("active", active)
                .addValue("qFilter", qFilter)
                .addValue("qLike", qLike)
                .addValue("size", safeSize)
                .addValue("offset", offset);

        return jdbc.query(sql, params, MAPPER);
    }

    public java.util.List<java.util.Map<String, Object>> listCustomers(int page, int size, String query, Boolean active) {
        int limit = Math.max(1, Math.min(100, size));
        int offset = Math.max(0, page) * limit;

        String qText = (query == null || query.isBlank()) ? null : "%" + query + "%";

        var p = new org.springframework.jdbc.core.namedparam.MapSqlParameterSource()
                .addValue("limit", limit)
                .addValue("offset", offset);

        var rows = jdbc.queryForList(sql, p);
        List<EmployeeDto> out = new ArrayList<>();
        for (Map<String,Object> r : rows) out.add(mapRowToEmployee(r));
        return out;

    }

    private CustomerDto buildSingleCustomerDto(List<Map<String,Object>> rows) {

        if (rows == null || rows.isEmpty()) {
            return null;
        }

        Map<String,Object> first = rows.get(0);

        Long id = getLong(first, "id");
        String username = getStr(first, "username");
        String firstName = getStr(first, "first_name");
        String lastName  = getStr(first, "last_name");
        String email     = getStr(first, "email");
        var dob          = getLocalDate(first, "date_of_birth");
        String phone     = getStr(first, "phone_number");
        String address   = getStr(first, "home_address");
        String egn       = getStr(first, "egn");
        String role      = getStr(first, "role");
        boolean active   = getBool(first, "active");
        OffsetDateTime createdAt = getOffset(first, "created_at");

        List<AccountDto> accounts = new ArrayList<>();

        for (Map<String,Object> r : rows) {

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

    private List<CustomerDto> groupRowsToCustomers(List<Map<String,Object>> rows) {

        Map<Long, Aggregator> byId = new LinkedHashMap<>();

        for (Map<String,Object> r : rows) {

            Long uid = getLong(r, "id");
            Aggregator agg = byId.computeIfAbsent(uid, k -> new Aggregator(r));
            agg.addAccount(r);

        }

        List<CustomerDto> out = new ArrayList<>(byId.size());
        for (Aggregator a : byId.values()) out.add(a.toDto());
        return out;

    }

    private EmployeeDto mapRowToEmployee(Map<String,Object> r) {

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
        final java.time.LocalDate dob;
        final String phone;
        final String address;
        final String egn;
        final String role;
        final boolean active;
        final OffsetDateTime createdAt;
        final List<AccountDto> accounts = new ArrayList<>();

        Aggregator(Map<String,Object> r) {

            this.id        = getLong(r, "id");
            this.username  = getStr(r, "username");
            this.firstName = getStr(r, "first_name");
            this.lastName  = getStr(r, "last_name");
            this.email     = getStr(r, "email");
            this.dob       = getLocalDate(r, "date_of_birth");
            this.phone     = getStr(r, "phone_number");
            this.address   = getStr(r, "home_address");
            this.egn       = getStr(r, "egn");
            this.role      = getStr(r, "role");
            this.active    = getBool(r, "active");
            this.createdAt = getOffset(r, "created_at");

        }

        void addAccount(Map<String,Object> r) {

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

    private static Long getLong(Map<String,Object> r, String k) {

        Object v = r.get(k);

        if (v instanceof Number n) {
            return n.longValue();
        }

        if (v instanceof String s) try { return Long.parseLong(s); } catch (Exception ignored) {}

        return null;

    }
    private static String getStr(Map<String,Object> r, String k) {

        Object v = r.get(k);
        return v == null ? null : v.toString();

    }
    private static boolean getBool(Map<String,Object> r, String k) {

        Object v = r.get(k);
        if (v instanceof Boolean b) return b;
        if (v instanceof Number n) return n.intValue() != 0;
        if (v instanceof String s) return Boolean.parseBoolean(s);
        return false;

    }
    private static OffsetDateTime getOffset(Map<String,Object> r, String k) {

        try {

            Object v = r.get(k);
            if (v instanceof OffsetDateTime odt) return odt;
            if (v instanceof Timestamp ts) return ts.toInstant().atOffset(ZoneOffset.UTC);
        } catch (Throwable ignored) {}

        return null;
    }
    private static BigDecimal getBigDec(Map<String,Object> r, String k) {

        Object v = r.get(k);
        if (v instanceof BigDecimal bd) return bd;
        if (v instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        if (v instanceof String s) try { return new BigDecimal(s); } catch (Exception ignored) {}
        return BigDecimal.ZERO;

    }
    private static java.time.LocalDate getLocalDate(Map<String,Object> r, String k) {

        Object v = r.get(k);
        if (v instanceof java.time.LocalDate ld) return ld;
        if (v instanceof java.sql.Date sd)       return sd.toLocalDate();
        if (v instanceof java.util.Date ud)
            return ud.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();

        if (v instanceof String s) {
            try { return java.time.LocalDate.parse(s); } catch (Exception ignored) {}
        }

        return null;
    }

}

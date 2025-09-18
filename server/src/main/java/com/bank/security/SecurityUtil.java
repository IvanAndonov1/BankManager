package com.bank.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collection;
import java.util.Locale;
import java.util.Map;

public final class SecurityUtil {
    private SecurityUtil() {}

    public static Long currentUserId() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null) return null;

        Object d = a.getDetails();
        if (d instanceof Map<?,?> m) {
            Object v = m.get("uid");
            if (v instanceof Number n) return n.longValue();
            // Strings that are numbers
            if (v instanceof String s) {
                try { return Long.parseLong(s); } catch (NumberFormatException ignored) {}
            }
        }
        Object p = a.getPrincipal();
        if (p instanceof Map<?,?> pm) {
            Object v = pm.get("uid");
            if (v instanceof Number n) return n.longValue();
            if (v instanceof String s) {
                try { return Long.parseLong(s); } catch (NumberFormatException ignored) {}
            }
        }

        return null;
    }

    public static String currentRole() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null) return null;

        Object d = a.getDetails();
        if (d instanceof Map<?,?> m) {
            Object v = m.get("role");
            if (v != null) return v.toString();
        }

        String authRole = firstAuthorityAsRole(a.getAuthorities());
        if (authRole != null) return authRole;

        Object p = a.getPrincipal();
        if (p instanceof Map<?,?> pm) {
            Object v = pm.get("role");
            if (v != null) return v.toString();
        }

        return null;
    }

    public static boolean isEmployeeOrAdmin() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a != null && hasAnyAuthority(a.getAuthorities(), "EMPLOYEE", "ADMIN")) {
            return true;
        }
        String r = currentRole();
        return equalsRole(r, "EMPLOYEE") || equalsRole(r, "ADMIN");
    }

    public static boolean isCustomer() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a != null && hasAnyAuthority(a.getAuthorities(), "CUSTOMER")) {
            return true;
        }
        String r = currentRole();
        return equalsRole(r, "CUSTOMER");
    }

    public static boolean isAdmin(){

        Authentication a = SecurityContextHolder.getContext().getAuthentication();

        if(a != null && hasAnyAuthority(a.getAuthorities(), "ADMIN")){
            return true;
        }

        String r = currentRole();

        return equalsRole(r, "ADMIN");

    }


    private static boolean equalsRole(String actual, String expected) {
        if (actual == null) return false;
        String norm = stripRolePrefix(actual).toUpperCase(Locale.ROOT);
        return norm.equals(expected.toUpperCase(Locale.ROOT));
    }

    private static String firstAuthorityAsRole(Collection<? extends GrantedAuthority> auths) {
        if (auths == null) return null;
        for (GrantedAuthority ga : auths) {
            if (ga == null) continue;
            String role = stripRolePrefix(ga.getAuthority());
            if (role != null && !role.isBlank()) return role;
        }
        return null;
    }

    private static boolean hasAnyAuthority(Collection<? extends GrantedAuthority> auths, String... roles) {
        if (auths == null) return false;
        for (GrantedAuthority ga : auths) {
            if (ga == null) continue;
            String got = stripRolePrefix(ga.getAuthority()).toUpperCase(Locale.ROOT);
            for (String want : roles) {
                if (got.equals(want.toUpperCase(Locale.ROOT))) return true;
            }
        }
        return false;
    }

    private static String stripRolePrefix(String s) {
        if (s == null) return null;
        if (s.startsWith("ROLE_")) return s.substring(5);
        return s;
    }
}

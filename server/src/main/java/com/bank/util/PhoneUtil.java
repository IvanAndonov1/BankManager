package com.bank.util;

public final class PhoneUtil {

    private PhoneUtil(){}

    public static String normalizeBgPhone(String phone) {

        if (phone == null) {
            return null;
        }

        String trimmed = phone.trim();

        if (trimmed.matches("^\\+359\\d{9}$")) {
            return trimmed;
        }

        if (trimmed.matches("^0\\d{9}$")) {
            return "+359" + trimmed.substring(1);
        }

        return null;

    }

}

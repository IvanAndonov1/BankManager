package com.bank.aspect;

import com.bank.dto.TransactionRequestDto;
import com.bank.dto.TransferRequestDto;
import com.bank.service.ApiLogService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Optional;

@Aspect
@Component
public class ApiLoggingAspect {

    private final ApiLogService logService;

    public ApiLoggingAspect(ApiLogService logService) {
        this.logService = logService;
    }

    @Around("within(@org.springframework.web.bind.annotation.RestController *)")
    public Object logApiCall(ProceedingJoinPoint pjp) throws Throwable {

        Object result = pjp.proceed();

        String methodName = pjp.getSignature().getName();
        Object[] args = pjp.getArgs();

        String currentUser = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(auth -> auth.getName()).orElse("anonymous");

        String fromAccountNumber = null;
        String toAccountNumber   = null;
        String amountStr         = null;

        try {

            MethodSignature sig = (MethodSignature) pjp.getSignature();
            Method m = sig.getMethod();
            String[] paramNames = sig.getParameterNames();
            Class<?>[] paramTypes = m.getParameterTypes();

            for (int i = 0; i < args.length; i++) {

                Object arg = args[i];

                if ("accountNumber".equals(paramNames[i]) && arg instanceof String s) {
                    fromAccountNumber = s;
                }

                if (arg instanceof TransferRequestDto dto) {

                    toAccountNumber = dto.toAccountNumber();
                    if (dto.amount() != null) amountStr = dto.amount().toPlainString();

                } else if (arg instanceof TransactionRequestDto dto) {
                    if (dto.amount() != null) amountStr = dto.amount().toPlainString();
                }
            }
        } catch (Exception ignore) {

            for (Object arg : args) {

                if (fromAccountNumber == null && arg instanceof String s) {
                    fromAccountNumber = s;
                }

                if (arg instanceof TransferRequestDto dto) {

                    toAccountNumber = dto.toAccountNumber();

                    if (dto.amount() != null) {
                        amountStr = dto.amount().toPlainString();
                    }
                } else if (arg instanceof TransactionRequestDto dto) {
                    if (dto.amount() != null) amountStr = dto.amount().toPlainString();
                }
            }
        }

        StringBuilder msg = new StringBuilder();
        msg.append("{").append(currentUser).append("} did {").append(methodName).append("}");

        if (fromAccountNumber != null) {
            msg.append(" from {").append(maskAcc(fromAccountNumber)).append("}");
        }
        if (toAccountNumber   != null) {
            msg.append(" to {").append(maskAcc(toAccountNumber)).append("}");
        }
        if (amountStr         != null) {
            msg.append(" amount=").append(amountStr);
        }

        logService.saveLog(currentUser, msg.toString());
        return result;
    }

    private String maskAcc(String acc) {

        if (acc == null) return null;
        int n = acc.length();
        if (n <= 10) return acc;
        return acc.substring(0, 6) + "…" + acc.substring(n - 4);

    }
}

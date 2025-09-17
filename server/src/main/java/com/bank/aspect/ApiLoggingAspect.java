package com.bank.aspect;

import com.bank.dto.TransferRequestDto;
import com.bank.service.ApiLogService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
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

        String method = pjp.getSignature().getName();  // e.g., deposit, transfer
        Object[] args = pjp.getArgs();

        String currentUser = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(auth -> auth.getName())
                .orElse("anonymous");

        StringBuilder message = new StringBuilder();
        message.append("{").append(currentUser).append("} did {").append(method).append("}");

        Arrays.stream(args).forEach(arg -> {
            if (arg instanceof TransferRequestDto dto) {
                message.append(" to {account ").append(dto.toAccountId()).append("}");
            }
        });

        // Save to DB
        logService.saveLog(currentUser, message.toString());

        return result;
    }
}


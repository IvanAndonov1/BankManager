import requester from "./requester";

const baseUrl = 'http://localhost:8080/api/auth';

export const forgotPassword = (data) => 
  requester.post(`${baseUrl}/forgot-password`, data);

export const verifyCode = (data) => 
  requester.post(`${baseUrl}/verify-reset-code`, data);

export const resetPassword = (data) => 
  requester.post(`${baseUrl}/reset-password`, data);

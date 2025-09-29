import requester from "./requester";

const baseUrl = 'https://bankmanager-2.onrender.com/auth';

export const forgotPassword = (data) => 
  requester.post(`${baseUrl}/forgot-password`, data);

export const verifyCode = (data) => 
  requester.post(`${baseUrl}/verify-reset-code`, data);

export const resetPassword = (data) => 
  requester.post(`${baseUrl}/reset-password`, data);

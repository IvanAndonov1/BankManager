import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL;

export const forgotPassword = (data) => 
  requester.post(`${baseUrl}/auth/forgot-password`, data);

export const verifyCode = (data) => 
  requester.post(`${baseUrl}/auth/verify-reset-code`, data);

export const resetPassword = (data) => 
  requester.post(`${baseUrl}/auth/reset-password`, data);

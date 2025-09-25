import requester from "./requester";

const baseUrl = 'http://localhost:8080/api';

export const forgotPassword = ( token, data) => requester.post(`${baseUrl}/auth/forgot-password`, data, { 'Authorization': `Bearer ${token}` });

export const resetPassword = ( token, data) => requester.post(`${baseUrl}/auth/reset-password`, data, { 'Authorization': `Bearer ${token}` });
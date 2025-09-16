import requester from './requester';

const baseUrl = 'http://localhost:8080/api';

export const loginUser = (data) => requester.post(`${baseUrl}/auth/login`, data);

export const registerUser = (data) => requester.post(`${baseUrl}/auth/register`, data);
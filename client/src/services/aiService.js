import requester from "./requester";

const baseUrl = 'http://localhost:8080/api';

export const aiGenerate = ( token, data) => requester.post(`${baseUrl}/ai/generate`, data, { 'Authorization': `Bearer ${token}` });

export const chatWithAi = ( token, data) => requester.post(`${baseUrl}/ai/chat`, data, { 'Authorization': `Bearer ${token}` });
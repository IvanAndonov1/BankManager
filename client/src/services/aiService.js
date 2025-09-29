import requester from "./requester";

const baseUrl = 'https://credian-api.onrender.com/api';

export const aiGenerate = ( token, data) => requester.post(`${baseUrl}/ai/generate`, data, { 'Authorization': `Bearer ${token}` });

export const chatWithAi = ( token, data) => requester.post(`${baseUrl}/ai/chat`, data, { 'Authorization': `Bearer ${token}` });
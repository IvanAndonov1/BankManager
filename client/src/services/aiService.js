import requester from "./requester";

const baseUrl = 'https://bankmanager-2.onrender.com';

export const aiGenerate = ( token, data) => requester.post(`${baseUrl}/ai/generate`, data, { 'Authorization': `Bearer ${token}` });

export const chatWithAi = ( token, data) => requester.post(`${baseUrl}/ai/chat`, data, { 'Authorization': `Bearer ${token}` });
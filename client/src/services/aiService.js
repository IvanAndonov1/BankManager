import requester from "./requester";

const baseUrl = import.meta.env.VITE_API_URL;

export const aiGenerate = ( token, data) => requester.post(`${baseUrl}/ai/generate`, data, { 'Authorization': `Bearer ${token}` });

export const chatWithAi = ( token, data) => requester.post(`${baseUrl}/ai/chat`, data, { 'Authorization': `Bearer ${token}` });
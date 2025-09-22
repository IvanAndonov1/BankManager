import requester from "./requester"; // your fetch wrapper
const baseUrl = "http://localhost:8080/api/loans";

// Function to request a loan quote
export const getLoanQuote = async (loanData, token) => {
  const body = {
    customerId: loanData.customerId,
    requestedAmount: loanData.requestedAmount,
    termMonths: loanData.termMonths,
    currentJobStartDate: loanData.currentJobStartDate,
    netSalary: loanData.netSalary
  };

  // Add Authorization header if your backend requires a token
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // requester.post automatically parses JSON and sends body
  const result = await requester.post(`${baseUrl}/quote`, body, headers);
  return result; // will be the JSON response from backend
};

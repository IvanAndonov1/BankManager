import requester from "./requester";

const baseUrl = "http://localhost:8080/api";

export const makeTransfer = (fromAccountNumber, token, data) => {
  return requester.post(
    `${baseUrl}/accounts/${fromAccountNumber}/transfer`,
    data,
    { Authorization: `Bearer ${token}` }
  );
};

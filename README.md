# BankManager
An app that allows banks to acess clients for loans.

    1) Backend Proxy
Във client/vite.config.js имаме прокси /api към бекенда:

server: {
proxy: {
"/api": { target: "http://localhost:8080", changeOrigin: true }
}
}

---
    2) Основни ендпойнтове
---
   Сметки (Accounts)

POST /api/accounts - създаване на сметка:
Body: json - {}
резултат: json
{
    "accountNumber": "BG80BNBG9661XXXXXXXXXX",
    "balance": 0.00
}

GET /api/accounts/me - връща списък с всичките сметки на логнатия customer: 

[
  {
    "accountNumber": "BG80BNBG9661XXXXXXXXXX",
    "balance": 0.00
  },
  {
    "accountNumber": "BG80BNBG9661XXXXXXXXXX",
    "balance": 250.00
  }
]

POST /api/accounts/{accountNumber}/deposit 
Body: json:
{
    "amount": 200,
    "description": "Test deposit"
}

POST /api/accounts/{accountNumber}/withdraw
Body: json:
{
    "amount": 200,
    "description": "Test withdraw"
}

POST /api/accounts/{fromAccountNumber}/transfer
Bodu: json:
{
  "toAccountNumber": "BG80BNBG9661XXXXXXXXXX",
  "amount": 100,
  "description": "Transfer test"
}

GET /api/accounts/by-id/{id} - връща ноомер на сметка и баланс по id на сметка - за служители и админ 
json:
{
    "accountNumber": BG80BNBG9661XXXXXXXXXX,
    "balance": 1500.00
}

GET /api/accounts/{accountNumber} - връща номер на сметка и баланс по номер на сметка - за всички 
json:
{
    "accountNumber": BG80BNBG9661XXXXXXXXXX,
    "balance": 1500.00
}

GET /api/accounts/by-customer/{customerId} – връща сметки на клиент по id на клиент - забранено за клиенти
json:
[
    {
        "accountNumber": "BG80BNBG9661XXXXXXXXXX",
        "balance": 12300.00
    },
    {
        "accountNumber": "BG80BNBG9661XXXXXXXXXX",
        "balance": 700.00
    }
]

Кредити (Loans)

POST /api/loans/applications – създава кредитна заявка.

POST /api/loans/applications/{id}/evaluate – оценка на кредитната заявка (връща статус и резултат).

GET /api/loans/{id} – връща данни за заявка.

---
    3) Примери

---
    3.2 Кредити
---

POST /api/loans/applications

{
"customerId": 1,
"productType": "CONSUMER",
"requestedAmount": 5000,
"termMonths": 24,
"employerStartDate": "2024-01-01",
"netSalary": 2500
}


Отговор:

{ "id": 123 }


POST /api/loans/applications/123/evaluate
Отговор:

{
"status": "APPROVED",
"reasons": [],
"tenureScore": 80,
"dtiScore": 100,
"incomeScore": 60,
"accountAgeScore": 20,
"cushionScore": 80,
"recentDebtScore": 60,
"composite": 76
}


GET /api/loans/123

{
"id": 123,
"customerId": 1,
"productType": "CONSUMER",
"requestedAmount": 5000,
"termMonths": 24,
"status": "APPROVED",
"score": 76,
"reasons": []
}


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

Authentication

POST /api/auth/register/customer - регистриране на клиент
body - json:
{
  "username": "cust",
  "password": "pasword",
  "firstName": "cust",
  "lastName": "cust",
  "email": "cust@example.com",
  "dateOfBirth": "1993-05-07",
  "phoneNumber": "+359888111222",
  "homeAddress": "Sofia, Test 1",
  "egn": "9305070000"
}
връща: 
{
    "username": "cust",
    "email": "cust@example.com",
    "role": "CUSTOMER",
    "firstName": "cust",
    "lastName": "cust",
    "dateOfBirth": "1993-05-07",
    "phoneNumber": "+359888111222",
    "homeAddress": "Sofia, Test 1",
    "egn": "9305070000"
}

POST /api/auth/register/employee - регистриране на служител (достъпен само ако си логнат като админ)
body - json:
{
  "username": "emp",
  "password": "password",
  "firstName": "emp",
  "lastName": "emp",
  "email": "emp@example.com",
  "dateOfBirth": "1993-05-07",
  "phoneNumber": "+359888111222",
  "homeAddress": "Sofia, Test 1",
  "egn": "9305070000"
}
връща:
{
    "id": 43,
    "username": "emp",
    "email": "emp@example.com",
    "role": "EMPLOYEE",
    "firstName": "emp",
    "lastName": "emp",
    "dateOfBirth": "1993-05-07",
    "phoneNumber": "+359888111222",
    "homeAddress": "Sofia, Test 1",
    "egn": "9305070000"
}

POST /api/auth/login
body - json:
{
  "username": "user",
  "password": "password"
}
връща:
{
    "username": "user",
    "role": "{ROLE}",
    "token": "{token}"
}

POST /api/auth/logout 
по токен
връща:
{
    "message": "Logged out successfully"
}

------------------------------------------------------------------------

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

-------------------------------------------------------------------------------------------------------------

Directory

GET /api/customers/all - достъпно за employee и admin, връща детайлно всички customers
пример: 

{
        "id": 39,
        "username": "petur",
        "firstName": "Petur",
        "lastName": "Mihaylov",
        "email": "petur@example.com",
        "dateOfBirth": "2000-07-11",
        "phoneNumber": "+359885643221",
        "homeAddress": "Sofia, ul. Hristo Botev 5",
        "egn": "0332134503",
        "role": "CUSTOMER",
        "active": true,
        "createdAt": "2025-09-20T08:47:29.452424Z",
        "accounts": [
            {
                "accountNumber": "BG80BNBG96610371551188",
                "balance": 0.00
            }
        ]
    },
    {
        "id": 38,
        "username": "klientZaem2",
        "firstName": "klientZaem2",
        "lastName": "klientZaem2",
        "email": "klientZaem2@example.com",
        "dateOfBirth": "1993-05-07",
        "phoneNumber": "+359888111222",
        "homeAddress": "Sofia, Test 1",
        "egn": "9305070000",
        "role": "CUSTOMER",
        "active": true,
        "createdAt": "2025-09-19T23:10:17.079815Z",
        "accounts": [
            {
                "accountNumber": "BG80BNBG96615477105317",
                "balance": 15000.00
            }
        ]
    }

GET /api/employees/all - достъпно за admin, връща детайлно всички employees
пример: 


GET /аpi/customers/by-id/{id} - достъпно за employee и admin, връща детайлно customer по id
GET /аpi/customers/by-username/{username} - достъпно за employee и admin, връща детайлно customer по username

Пример: 

{
    "id": 39,
    "username": "petur",
    "firstName": "Petur",
    "lastName": "Mihaylov",
    "email": "petur@example.com",
    "dateOfBirth": "2000-07-11",
    "phoneNumber": "+359885643221",
    "homeAddress": "Sofia, ul. Hristo Botev 5",
    "egn": "0332134503",
    "role": "CUSTOMER",
    "active": true,
    "createdAt": "2025-09-20T08:47:29.452424Z",
    "accounts": [
        {
            "accountNumber": "BG80BNBG96610371551188",
            "balance": 0.00
        }
    ]
}

GET /аpi/employees/by-id/{id} - достъпно за admin, връща детайлно employee по id
GET /аpi/employees/by-username/{username} - достъпно за admin, връща детайлно employee по username

Пример:

{
    "id": 15,
    "username": "employeeTest",
    "firstName": "Employee",
    "lastName": "Tester",
    "email": "employeeTest@example.com",
    "dateOfBirth": "1990-01-10",
    "phoneNumber": "+359888555222",
    "homeAddress": "Plovdiv, Test Street 2",
    "egn": "9001101234",
    "role": "EMPLOYEE",
    "active": true,
    "createdAt": "2025-09-17T19:55:50.88103Z"
}


---------------------------------------------------------------------------------------------------

Ме 
GET /api/users/me - връща информацията за текущо логнатия user
пример (customer):
{
    "username": "Customer",
    "firstName": "Customer",
    "lastName": "Customer",
    "email": "Customer@example.com",
    "dateOfBirth": "1990-01-10",
    "phoneNumber": "+359884455242",
    "homeAddress": "Plovdiv, Test Street 2",
    "egn": "9101162634",
    "role": "CUSTOMER",
    "active": true,
    "createdAt": "2025-09-18T07:50:50.812898Z",
    "accounts": [
        {
            "accountNumber": "BG80BNBG96618415309144",
            "balance": 150.00
        }
    ]
}

пример(employee):
{
    "username": "Customer",
    "firstName": "Customer",
    "lastName": "Customer",
    "email": "Customer@example.com",
    "dateOfBirth": "1990-01-10",
    "phoneNumber": "+359888455242",
    "homeAddress": "Plovdiv, Test Street 2",
    "egn": "9001162634",
    "role": "EMPLOYEE",
    "active": true,
    "createdAt": "2025-09-18T07:47:08.105027Z"
}


--------------------------------------------------------------



Кредити (Loans)

GET /api/loans/quote - изчислява месечна вноска и крайна сума за плащане за кредит

пример: /api/loans/quote?requestedAmount=15000.00&termMonths=48

връща: 

{
    "currency": "EUR",
    "annualRate": 0.05,
    "monthlyPayment": 345.44,
    "totalPayable": 16581.12,
    "requestedAmount": 15000.00,
    "termMonths": 48
}

POST /api/loans/applications - създава заявление за кредит

body - json:

{
  "requestedAmount": 15000.00,
  "termMonths": 48,
  "currentJobStartDate": "2020-05-15",
  "netSalary": 2000.00,
  "targetAccountNumber": "BG80BNBG96614314017626"
}

връща: 

{
    "annualRate": 0.05,
    "targetAccountNumber": "BG80BNBG96614314017626",
    "evaluation": {
        "percentageOfMax": 64.0,
        "maxPossiblePoints": 500,
        "creditScore": "320/500",
        "scores": {
            "cushion": 0,
            "tenure": 100,
            "dti": 100,
            "recentDebt": 100,
            "accountAge": 20
        },
        "accumulatedPoints": 320
    },
    "currency": "EUR",
    "status": "PENDING",
    "monthlyPayment": 345.44,
    "totalPayable": 16581.12
}

GET /api/loans/applications/mine - връща applications на логнатия customer

връща: 

[
    {
        "requestedAmount": 15000.00,
        "termMonths": 48,
        "status": "PENDING",
        "currency": "EUR",
        "createdAt": "2025-09-20T16:20:32.293323Z",
        "updatedAt": "2025-09-20T16:20:32.407719Z",
        "evaluation": {
            "percentageOfMax": 64.0,
            "maxPossiblePoints": 500,
            "creditScore": "320/500",
            "scores": {
                "cushion": 0,
                "tenure": 100,
                "dti": 100,
                "recentDebt": 100,
                "accountAge": 20
            },
            "accumulatedPoints": 320
        }
    }
]

GET /api/loans/applications/{id}/evaluate - оценява отново заявлението (ако искаш да направиш вторично изчисление, ако си служител) по неговото id 

връща: 

{
    "status": "PENDING",
    "reasons": [],
    "tenureScore": 100,
    "dtiScore": 100,
    "accountAgeScore": 20,
    "cushionScore": 0,
    "recentDebtScore": 100,
    "composite": 64,
    "accumulatedPoints": 320,
    "maxPossiblePoints": 500,
    "percentageOfMax": 64.0,
    "creditScore": "320/500",
    "recommendation": "CONSIDER"
}

POST /api/loans/applications/{id}/decision - служителя решава дали да приеме или откаже кредита, подава се id на заявлението

body: 
{
    "approve":true
}

връща:

{
    "status": "APPROVED",
    "ok": true
}

body:
{
    "approve":false,
    "reasons" : ["Bad incomes."]
}

връща:

{
    "status": "DECLINED",
    "ok": true
}

GET /api/loans/applications - връща всички заявки за кредит с подробности - дотъпно само за служители и админ 

примерна: 

 {
        "id": 22,
        "customerId": 46,
        "requestedAmount": 20000.00,
        "termMonths": 48,
        "status": "APPROVED",
        "currentJobStartDate": "2020-05-15",
        "netSalary": 3000.00,
        "currency": "EUR",
        "nominalAnnualRate": 0.050,
        "monthlyPayment": 460.59,
        "totalPayable": 22108.32,
        "targetAccountNumber": "BG80BNBG96616468523546",
        "decidedByUserId": 22,
        "decidedAt": "2025-09-20T19:22:07.087125Z",
        "reasons": [],
        "tenureScore": 100,
        "dtiScore": 75,
        "accountAgeScore": 20,
        "cushionScore": 100,
        "recentDebtScore": 60,
        "composite": 71,
        "accumulatedPoints": 355,
        "maxPossiblePoints": 500,
        "percentageOfMax": 71.0,
        "creditScore": "355/500",
        "recommendation": "APPROVE",
        "disbursedAt": "2025-09-20T19:22:07.087125Z",
        "disbursedAmount": 20000.00,
        "createdAt": "2025-09-20T19:20:14.72933Z",
        "updatedAt": "2025-09-20T19:22:07.087125Z"
    }


----------------------------------------------------------------------------

Transactions: 

GET /api/accounts/{accountNumber}/transactions 

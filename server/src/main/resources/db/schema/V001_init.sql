-- not the final tables just for the setup !!!!

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(64) NOT NULL,
    last_name  VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    role VARCHAR(16) NOT NULL CHECK (role IN ('CUSTOMER','EMPLOYEE','ADMIN'))
);

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_number VARCHAR(34) NOT NULL UNIQUE,
    balance NUMERIC(19,4) NOT NULL DEFAULT 0,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    type VARCHAR(16) NOT NULL CHECK (type IN ('DEPOSIT','WITHDRAW','TRANSFER')),
    amount NUMERIC(19,4) NOT NULL,
    occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
    description TEXT
);






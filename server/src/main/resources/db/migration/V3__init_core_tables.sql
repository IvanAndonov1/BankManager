-- USERS
CREATE TABLE IF NOT EXISTS users (
                                     id           BIGSERIAL PRIMARY KEY,
                                     name         VARCHAR(120) NOT NULL,
    password     VARCHAR(255) NOT NULL,
    first_name   VARCHAR(120),
    last_name    VARCHAR(120),
    email        VARCHAR(180) UNIQUE NOT NULL,
    role         VARCHAR(20)  NOT NULL
    );

-- CUSTOMERS (1:1 with users)
CREATE TABLE IF NOT EXISTS customers (
                                         id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
    );

-- ACCOUNTS (customer -> accounts 1:N)
CREATE TABLE IF NOT EXISTS accounts (
                                        id             BIGSERIAL PRIMARY KEY,
                                        customer_id    BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    account_number VARCHAR(32) UNIQUE NOT NULL,
    balance        NUMERIC(18,2) NOT NULL DEFAULT 0
    );

-- TRANSACTIONS (account -> transactions 1:N)
CREATE TABLE IF NOT EXISTS transactions (
                                            id          BIGSERIAL PRIMARY KEY,
                                            account_id  BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    type        VARCHAR(20) NOT NULL,            -- use your TransactionType enum names
    amount      NUMERIC(18,2) NOT NULL,
    date_time   TIMESTAMPTZ NOT NULL DEFAULT now(),
    description TEXT
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_accounts_customer ON accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_tx_account_time  ON transactions(account_id, date_time);

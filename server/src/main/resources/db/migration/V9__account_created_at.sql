ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- optional index if you’ll query by created_at often
CREATE INDEX IF NOT EXISTS idx_accounts_customer_created
    ON accounts(customer_id, created_at);

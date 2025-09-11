-- V13__loan_pricing.sql
ALTER TABLE loan_applications
    ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'EUR',
    ADD COLUMN IF NOT EXISTS nominal_annual_rate NUMERIC(6, 3),
    ADD COLUMN IF NOT EXISTS monthly_payment NUMERIC(14, 2),
    ADD COLUMN IF NOT EXISTS total_payable NUMERIC(16, 2);

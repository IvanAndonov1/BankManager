ALTER TABLE loan_applications
ADD COLUMN IF NOT EXISTS target_account_id BIGINT,
ADD COLUMN IF NOT EXISTS disbursed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS disbursed_amount NUMERIC(18, 2);

ALTER TABLE loan_applications
ADD CONSTRAINT fk_loan_app_target_account_id
FOREIGN KEY (target_account_id) REFERENCES accounts(id);


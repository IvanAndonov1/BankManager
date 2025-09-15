ALTER TABLE loan_applications
    ADD COLUMN decided_by_user_id BIGINT,
    ADD COLUMN decided_at TIMESTAMPTZ;

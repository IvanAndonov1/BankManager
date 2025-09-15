ALTER TABLE loan_applications
    ADD COLUMN evaluation_composite NUMERIC(5,2),
    ADD COLUMN evaluation_reasons TEXT,
    ADD COLUMN evaluation_status VARCHAR(32);

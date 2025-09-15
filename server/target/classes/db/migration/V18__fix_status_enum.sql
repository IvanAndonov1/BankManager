ALTER TABLE loan_applications
DROP CONSTRAINT loan_applications_status_check;

ALTER TABLE loan_applications
    ADD CONSTRAINT loan_applications_status_check
        CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED'));

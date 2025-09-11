UPDATE loan_applications
SET status = 'PENDING'
WHERE status NOT IN ('PENDING', 'APPROVED', 'DECLINED');

ALTER TABLE loan_applications
ALTER COLUMN status SET DEFAULT 'PENDING';

DO $$
BEGIN
ALTER TABLE loan_applications DROP CONSTRAINT IF EXISTS loan_app_status_chk;
END$$;

ALTER TABLE loan_applications
ADD CONSTRAINT loan_app_status_chk
CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED'));
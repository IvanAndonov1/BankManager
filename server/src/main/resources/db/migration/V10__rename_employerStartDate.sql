DO $$
BEGIN

IF EXISTS(
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'loan_applications'
    AND column_name = 'employer_start_date'
) AND NOT EXISTS(
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'loan_applications'
    AND column_name = 'current_job_start_date'
) THEN
  ALTER TABLE loan_applications
  RENAME COLUMN employer_start_date TO current_job_start_date;
  END IF;
  END$$
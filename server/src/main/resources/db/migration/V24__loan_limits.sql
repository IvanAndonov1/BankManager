DO $$
BEGIN

BEGIN
ALTER TABLE loan_applications
ADD CONSTRAINT loan_amount_limit_chk
CHECK (requested_amount > 0 AND requested_amount <= 50000);
EXCEPTION WHEN duplicate_object THEN NULL;
END;

BEGIN
ALTER TABLE loan_applications
ADD CONSTRAINT loan_term_limit_chk
CHECK (term_months >= 1 AND term_months <= 120);
EXCEPTION WHEN duplicate_object THEN NULL;
END;

END$$;
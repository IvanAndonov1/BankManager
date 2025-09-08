-- Make sure the target table exists as "loan_applications"
DO $$
BEGIN
  -- If plural table doesn't exist…
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'loan_applications'
  ) THEN
    -- …but a legacy singular exists, rename it
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'loan_application'
    ) THEN
      EXECUTE 'ALTER TABLE loan_application RENAME TO loan_applications';
ELSE
      -- …otherwise create a fresh table with minimal required columns
      EXECUTE $CT$
CREATE TABLE loan_applications (
                                   id               BIGSERIAL PRIMARY KEY,
                                   customer_id      BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
                                   product_type     TEXT   NOT NULL,
                                   requested_amount NUMERIC(18,2) NOT NULL,
                                   term_months      INT    NOT NULL CHECK (term_months > 0),
                                   status           TEXT   NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','EVALUATED','APPROVED','DECLINED')),
                                   reasons          TEXT[] NOT NULL DEFAULT '{}',
                                   score            INT    NOT NULL DEFAULT 0,
                                   employer_start_date DATE,
                                   net_salary       NUMERIC(12,2),
                                   created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
                                   updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
)
    $CT$;
END IF;
END IF;
END
$$;

-- Ensure all columns exist (safe to re-run)
ALTER TABLE loan_applications
    ADD COLUMN IF NOT EXISTS employer_start_date DATE,
    ADD COLUMN IF NOT EXISTS net_salary NUMERIC(12,2),
    ADD COLUMN IF NOT EXISTS score INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS reasons TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS product_type TEXT,
    ADD COLUMN IF NOT EXISTS term_months INT;

-- Tighten status if it's TEXT (ignore if you use enum)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'loan_applications' AND column_name = 'status' AND data_type = 'text'
  ) THEN
BEGIN
ALTER TABLE loan_applications
    ADD CONSTRAINT loan_app_status_chk
        CHECK (status IN ('DRAFT','EVALUATED','APPROVED','DECLINED'));
EXCEPTION WHEN duplicate_object THEN
      -- constraint already exists
      NULL;
END;
END IF;
END$$;

-- Helpful index (safe if already present)
CREATE INDEX IF NOT EXISTS idx_loans_customer_status
    ON loan_applications(customer_id, status);

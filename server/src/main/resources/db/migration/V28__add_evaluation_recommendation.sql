ALTER TABLE loan_applications
ADD COLUMN IF NOT EXISTS evaluation_recommendation VARCHAR(16);
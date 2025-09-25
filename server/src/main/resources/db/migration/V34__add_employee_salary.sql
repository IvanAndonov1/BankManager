ALTER TABLE users
ADD COLUMN salary NUMERIC(19, 2);

UPDATE users
SET salary = 0.00
WHERE role = 'EMPLOYEE' AND salary IS NULL;

ALTER TABLE users
ADD CONSTRAINT chk_users_salary_nonneg CHECK (salary IS NULL OR salary >= 0);
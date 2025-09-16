CREATE OR REPLACE VIEW v_customer_monthly_installments AS
SELECT
customer_id,
COALESCE(SUM(
COALESCE(monthly_payment, requested_amount / NULLIF(term_months, 0))
), 0)::NUMERIC(14,2) AS monthly_installments
FROM loan_applications
WHERE status = 'APPROVED'
GROUP BY customer_id;

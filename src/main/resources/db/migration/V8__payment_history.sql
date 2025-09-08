-- Tracks whether a customer had a late payment on a given date
CREATE TABLE IF NOT EXISTS payment_history (
                                               id          BIGSERIAL PRIMARY KEY,
                                               customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    was_late    BOOLEAN NOT NULL,
    occurred_at DATE NOT NULL
    );

CREATE INDEX IF NOT EXISTS idx_payment_customer ON payment_history(customer_id);

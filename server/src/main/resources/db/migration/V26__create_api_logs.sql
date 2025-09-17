CREATE TABLE api_logs (
                          id BIGSERIAL PRIMARY KEY,
                          user_name VARCHAR(120),
                          message TEXT NOT NULL,
                          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

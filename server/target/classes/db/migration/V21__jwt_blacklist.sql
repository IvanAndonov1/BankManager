CREATE TABLE IF NOT EXISTS blacklisted_tokens (
                                                  id BIGSERIAL PRIMARY KEY,
                                                  token VARCHAR(500) NOT NULL,
    user_id BIGINT NOT NULL,
    blacklisted_at TIMESTAMP DEFAULT now()
    );

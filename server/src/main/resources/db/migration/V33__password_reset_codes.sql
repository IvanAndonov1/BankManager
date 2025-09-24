CREATE TABLE password_reset_tokens (
                                       id BIGSERIAL PRIMARY KEY,
                                       user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                       code VARCHAR(10) NOT NULL,
                                       expires_at TIMESTAMP NOT NULL,
                                       used BOOLEAN DEFAULT FALSE
);

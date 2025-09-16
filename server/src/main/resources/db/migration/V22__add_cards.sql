CREATE TABLE cards (
                       id BIGSERIAL PRIMARY KEY,
                       account_id BIGINT NOT NULL REFERENCES accounts(id),
                       card_number VARCHAR(20) NOT NULL,
                       expiration DATE NOT NULL,
                       type VARCHAR(50) NOT NULL
);

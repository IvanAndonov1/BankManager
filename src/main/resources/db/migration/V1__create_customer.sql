CREATE TABLE IF NOT EXISTS customer (
                                        id BIGSERIAL PRIMARY KEY,
                                        username VARCHAR(120) NOT NULL UNIQUE
    );

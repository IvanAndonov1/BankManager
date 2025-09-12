-- Добавя дата на регистрация и статус към users
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

-- Индекс по роля
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

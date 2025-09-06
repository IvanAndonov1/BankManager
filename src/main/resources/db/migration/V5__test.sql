CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

INSERT INTO users(name,password,first_name,last_name,email,role)
VALUES ('demo','secret','Ivan','Andonov','ivan@example.com','CUSTOMER')
    ON CONFLICT (email) DO NOTHING;

INSERT INTO customers(id)
SELECT id FROM users WHERE email='ivan@example.com'
    ON CONFLICT DO NOTHING;

INSERT INTO accounts (customer_id, account_number, balance)
SELECT id, 'BG80BNBG96611020345678', 1000
FROM users WHERE email='ivan@example.com'
    ON CONFLICT DO NOTHING;
INSERT INTO users (name, password, first_name, last_name, email, role)
VALUES ('cust1','pw','Ivan','Andonov','ivan@example.com','CUSTOMER')
    RETURNING id;
-- Suppose it returns 1

INSERT INTO customers (id) VALUES (1);

INSERT INTO accounts (customer_id, account_number, balance)
VALUES (1, 'BG80BNBG96611020345678', 1000) RETURNING id;

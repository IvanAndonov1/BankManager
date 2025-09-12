INSERT INTO users(name, password, first_name, last_name, email, role, created_at, active)
VALUES ('employee1', '$2a$10$zN2N9pX8o5j1nDgqWZ0Qiu5rBqQ2FQ6o1J3wDg7y9m3vX6m3Oq7aK', 'Emp', 'One', 'emp1@example.com', 'EMPLOYEE', now(), true)
    ON CONFLICT DO NOTHING;
/*
Password hash above is BCrypt("secret123") — login with:
username: employee1
password: secret123
*/

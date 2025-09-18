INSERT INTO users(name, password, first_name, last_name, email, role, created_at, active)
VALUES (
    'adminTest',
    '$2a$10$JRZC65V1NBpbYwXDZjzj7Ovde1Jad1fspqkJqGFgmd6rSB39lSBkG', -- "password"
     'Admin',
     'Adminov',
     'admin1@example',
     'ADMIN',
     now(),
     true
) ON CONFLICT (email) DO NOTHING;

# Credian – Server (Backend)

## 🧭 Overview

The **server** is a Spring Boot backend for the Credian digital banking platform. It exposes REST endpoints used by the frontend (client) and implements business logic for Customers, Employees and Admins.

Key responsibilities:
- Authentication (JWT)
- User, Account and Card management
- Loan processing and approval workflows
- Transaction handling and transfers
- Analytics and reporting endpoints
- Email notifications (SMTP)

By default the API is served under `http://localhost:8080` (Spring Boot default). The frontend (client) expects the backend available at this address during development.

---

## 🛠️ Tech Stack

- Java 21 (compiled with Maven)
- Spring Boot 3.5.x (Web, Security, Data JPA, Validation, Cache, Mail)
- PostgreSQL (runtime)
- Flyway for database migrations
- JWT (jjwt) for token-based auth
- Caffeine for caching
- springdoc (OpenAPI UI) for API documentation

---

## 📁 Project Structure (important folders)

```text
server/
├─ Dockerfile
├─ HELP.md
├─ mvnw
├─ mvnw.cmd
├─ pom.xml
├─ README.md
├─ .mvn/
│  └─ wrapper/
│     └─ maven-wrapper.properties
├─ src/
│  ├─ main/
│  │  ├─ java/
│  │  │  └─ com/bank/
│  │  │     ├─ DbSmoke.java
│  │  │     ├─ ServerApplication.java
│  │  │     ├─ aspect/
│  │  │     ├─ config/
│  │  │     ├─ dao/
│  │  │     ├─ dto/
│  │  │     ├─ enums/
│  │  │     ├─ exception/
│  │  │     ├─ health/
│  │  │     ├─ models/
│  │  │     ├─ security/
│  │  │     ├─ service/
│  │  │     ├─ util/
│  │  │     └─ web/
│  │  └─ resources/
│  │     ├─ application.properties
│  │     └─ db/
│  │        └─ migration/           # Flyway SQL migrations (V1__*.sql ... V34__*.sql)
│  └─ test/
│     ├─ java/
│     │  └─ com/bank/bdd/
│     │     ├─ steps/
│     │     ├─ CucumberSpringConfig
│     │     ├─ RunCucumberTest
│     │     └─ TestContext
│     └─ resources/
│        └─ cucumber/
│           ├─ auth.feature
│           ├─ customers.feature
│           └─ employees.feature
├─ target/
│  ├─ classes/
│  │  ├─ application.properties
│  │  └─ db/migration/               # compiled/copied migrations and generated classes
│  └─ test-classes/
└─ (other build outputs)
```

---

## 🔑 Core Concepts & Conventions

- Authentication
  - JWT tokens are used; secret and TTL are configured via `app.jwt.*` properties (see `application.properties`).
- Data Persistence
  - Spring Data JPA with PostgreSQL. DB migrations run via Flyway from `classpath:db/migration`.
- API Docs
  - OpenAPI UI (springdoc) is included — visit `/swagger-ui.html` (or `/swagger-ui/index.html`) when the server is running.
- Caching
  - Caffeine is used for in-memory caching; settings are configured in properties.

---

## ▶️ Running the Server (development)

### Prerequisites
- Java 21 (JDK)
- Maven
- PostgreSQL (or configure a hosted DB)

> The project includes an `application.properties` in `target/classes` with example values used during development. Do NOT commit real secrets; prefer environment variables or externalized config for production.

### Common dev flow

1. Set environment variables or edit `src/main/resources/application.properties` with your DB and mail credentials (recommended: use env vars or a separate config file).

2. Build & run with Maven:

```bash
cd server
mvn clean spring-boot:run
```

Or build the jar and run:

```bash
cd server
mvn clean package
java -jar target/server-0.0.1-SNAPSHOT.jar
```

The server will start on port 8080 by default. To change the port, set `server.port` in properties or pass `-Dserver.port=XXXX` when running.

---

## ⚙️ Configuration (notable properties)

- spring.datasource.url / username / password — PostgreSQL JDBC URL and credentials
- spring.flyway.enabled — enable/disable Flyway migrations
- app.jwt.secret — JWT signing secret (DEV only in repo; move to env var)
- app.jwt.ttl-minutes — token TTL in minutes
- spring.mail.* — SMTP settings used for email notifications
- ollama.base-url — local LLM service base URL (used by AI features, if present)

Example (sensitive values should come from env or a secrets manager):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/credian
spring.datasource.username=credian
spring.datasource.password=secret
app.jwt.secret=${JWT_SECRET}
app.jwt.ttl-minutes=120
```

---

## 🧪 Tests

The project contains unit and integration tests (JUnit 5, Cucumber, Rest-Assured). Run tests with Maven:

```bash
cd server
mvn test
```

---

## 📡 API & Docs

- OpenAPI / Swagger UI is exposed by springdoc. With the app running, open the UI at:

  http://localhost:8080/swagger-ui.html

- API endpoints follow REST conventions and are grouped by domain (auth, users, loans, transfers, analytics, admin).

---


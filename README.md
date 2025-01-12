# API Test Project

## Overview

This project uses the **Playwright** framework for comprehensive API testing. It validates HTTP requests (`GET`, `POST`, etc.), verifies response codes, and checks server behavior under various scenarios. The tests aim to ensure API stability, expected functionality, and adherence to defined behavior.

---

## Test Cases

### GET Requests

| Test Name                                          | Endpoint                                | Expected Response |
| -------------------------------------------------- | --------------------------------------- | ----------------- |
| Valid `orderId`                                    | `/test-orders/{orderId}` (1..10)        | `200 OK`          |
| Invalid `orderId` (less than 1 or greater than 10) | `/test-orders/{orderId}` (-1, 11)       | `400 Bad Request` |
| Non-existent `orderId`                             | `/test-orders/{orderId}` (e.g., `9999`) | `400 Bad Request` |

### POST Requests

| Test Name               | Endpoint       | Expected Response |
| ----------------------- | -------------- | ----------------- |
| Valid data              | `/test-orders` | `201 Created`     |
| Valid data with headers | `/test-orders` | `201 Created`     |
| Unexpected fields       | `/test-orders` | `200 OK`          |

### Authentication Tests

| Test Name                                      | Endpoint          | Expected Response           |
| ---------------------------------------------- |-------------------| --------------------------- |
| Login with valid credentials                   | `/login/student`  | `200 OK` (JWT token)        |
| Login with invalid credentials                 |  `/login/student` | `401 Unauthorized`          |
| Login using unsupported HTTP method (e.g., `PUT`) | `/login/student`  | `405 Method Not Allowed` |

---

## Technologies Used

- **Playwright**: Automated API testing.
- **TypeScript**: Ensures type safety and enhances development practices.
- **Swagger**: API documentation and endpoint exploration.
- **dotenv**: For managing environment variables securely.
- **Node.js**: Runtime environment for the project.
- **Prettier**: Code formatting (configured with a pre-commit hook).
- **StatusCodes**: For validating HTTP response codes.

---

## Project Configuration

### Playwright Configuration

The project uses a custom `playwright.config.ts` file with the following key features:

- **Workers**: Parallel test execution with 2 workers (adjustable).
- **Retries**: Tests are retried once on failure (2 retries in CI).
- **Tracing**: Enabled for debugging (`trace: 'on'`).
- **Screenshots**: Captured only on test failure (`screenshot: 'only-on-failure'`).
- **Video Recording**: Retained for failed tests (`video: 'retain-on-failure'`).
- **Environment-specific Settings**:
   - Base URL: `https://backend.tallinn-learning.ee/`
   - Custom headers for API requests.
   - Separate configurations for mobile and desktop testing.

### Environment Variables

Add the following to a `.env` file:

```env
USER=piret_luik
PASSWORD=yourpassword
```

The project uses `dotenv` to load these variables securely:

```typescript
import dotenv from 'dotenv';
dotenv.config();
```

---

## Running Tests

### Prerequisites

1. Ensure Node.js is installed.
2. Install dependencies:

   ```bash
   npm install
   ```

### Running All Tests

Execute the following command:

```bash
npx playwright test
```

### Running Specific Tests

Run a single test file:

```bash
npx playwright test tests/Dto/login-api.spec.ts
```

Run tests with a specific project (e.g., `Mobile tests`):

```bash
npx playwright test --project="Mobile tests"
```

### Viewing Reports

To view the last test report:

```bash
npx playwright show-report
```

To view traces for debugging:

```bash
npx playwright show-trace test-results/<trace-file>.zip
```

---

## Project Structure

```
project-root/
├── tests/
│   ├── Dto/
│   │   ├── login-api.spec.ts
│   │   ├── login-dto.ts
│   │   └── order-dto.tests.ts
│   └── simple-solution-api.spec.ts
├── playwright-report/
├── test-results/
├── .env
├── package.json
├── tsconfig.json
└── playwright.config.ts
```

---

## Troubleshooting

### Common Issues

1. **Authentication Fails (`401 Unauthorized`)**:
   - Verify `.env` file contains correct `USER` and `PASSWORD` values.
   - Ensure the backend API is reachable.

2. **Test Failures (`405 Method Not Allowed`)**:
   - Check the HTTP method used in the test.
   - Validate API endpoints and Swagger documentation.

3. **Missing Dependencies**:
   - Run `npm install` to ensure all dependencies are installed.

4. **Trace File Not Found**:
   - Ensure `trace` is enabled in the configuration.
   - Check if the `test-results/` directory contains `.zip` files.

---

## Additional Notes

- Customize the `playwright.config.ts` file as needed for project-specific requirements.
- Use `Swagger` for exploring endpoints and understanding API behavior.
- For advanced debugging, enable Playwright’s `debug` mode:

   ```bash
   PWDEBUG=1 npx playwright test
   

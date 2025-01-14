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
| Login with invalid credentials                 | `/login/student`  | `401 Unauthorized`          |
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

Add the following to a `.env` file (use your own credentials):

```env
USER=your_username
PASSWORD=your_password



# API Test Project

## Overview

This project uses the Playwright framework for API testing. It focuses on verifying HTTP requests (`GET`, `POST`), validating response codes, and testing server behavior under various scenarios.

The goal of the tests is to ensure API stability, expected functionality, and adherence to defined behavior.

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

---

## Technologies Used

- **Playwright**: Automated API testing.
- **TypeScript**: Ensuring type safety and better development practices.
- **Swagger**: API documentation and endpoint exploration.
- **StatusCodes**: For validating HTTP response codes.
- **Node.js**: Runtime environment for the project.
- **Prettier**: Code formatting (with a pre-commit hook).

---

## Running Tests

### Prerequisites

1. Ensure Node.js is installed.
2. Install dependencies:

   ```bash
   npm install
   ```

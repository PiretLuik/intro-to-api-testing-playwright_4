# API Test Project

## Overview

This project utilizes the Playwright framework for API testing. It focuses on verifying various HTTP requests (`GET`, `POST`), validating response codes, testing server behavior under different scenarios, and ensuring responses match defined JSON schemas.

The goal of the tests is to ensure API stability, expected functionality, and adherence to data structure standards.

---

## Test Cases

### GET Requests

| Test Name                                          | Endpoint                                  | Expected Response |
| -------------------------------------------------- | ----------------------------------------- | ----------------- |
| Valid `orderId`                                    | `/test-orders/{orderId}` (1..10)          | `200 OK`          |
| Invalid `orderId` (less than 1 or greater than 10) | `/test-orders/{orderId}` (-1, 11)         | `400 Bad Request` |
| Non-numeric `orderId`                              | `/test-orders/{orderId}` (e.g., `abc123`) | `400 Bad Request` |
| Non-existent `orderId`                             | `/test-orders/{orderId}` (e.g., `9999`)   | `400 Bad Request` |

### POST Requests

| Test Name               | Endpoint       | Expected Response |
| ----------------------- | -------------- | ----------------- |
| Valid data              | `/test-orders` | `201 Created`     |
| Invalid data            | `/test-orders` | `400 Bad Request` |
| Unexpected fields       | `/test-orders` | `200 OK`          |
| Valid data with headers | `/test-orders` | `201 Created`     |

### JSON Schema Validation

| Test Name                         | Endpoint       | Expected Behavior                        |
| --------------------------------- | -------------- | ---------------------------------------- |
| Validate API response with schema | `/test-orders` | Ensures API response matches JSON schema |

---

## Technologies Used

- **Playwright**: Automated API testing.
- **TypeScript**: Ensuring type safety and better development practices.
- **Swagger**: API documentation and endpoint exploration.
- **StatusCodes**: For validating HTTP response codes.
- **AJV**: For JSON schema validation.
- **Node.js**: Runtime environment for the project.
- **Prettier**: Code formatting (with a pre-commit hook).

---

## Running Tests

1. Ensure Node.js is installed.
2. Install dependencies:
   npm install

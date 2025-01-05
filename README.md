# API Test Project

## Overview

This project utilizes the Playwright framework for API testing. It focuses on verifying various HTTP requests (`GET`, `POST`), validating response codes, and testing server behavior under different scenarios.

The goal of the tests is to ensure API stability and expected functionality.

---

## Test Cases

### GET Requests

| Test Name                                          | Endpoint                                  | Expected Response |
| -------------------------------------------------- | ----------------------------------------- | ----------------- |
| Valid `orderId`                                    | `/test-orders/{orderId}` (1..10)          | `200 OK`          |
| Invalid `orderId` (less than 1 or greater than 10) | `/test-orders/{orderId}` (-1, 11)         | `400 Bad Request` |
| Non-numeric `orderId`                              | `/test-orders/{orderId}` (e.g., `abc123`) | `400 Bad Request` |

### POST Requests

| Test Name    | Endpoint       | Expected Response |
| ------------ | -------------- | ----------------- |
| Valid data   | `/test-orders` | `201 Created`     |
| Invalid data | `/test-orders` | `400 Bad Request` |

---

## Technologies Used

- **Playwright**: Automated API testing.
- **Swagger**: API documentation and endpoint exploration.
- **StatusCodes**: For validating response codes.
- **Node.js**: Runtime environment for the project.
- **Prettier**: Code formatting (with a pre-commit hook).

---

## Running Tests

1. Ensure Node.js is installed.
2. Install dependencies:

   npm install

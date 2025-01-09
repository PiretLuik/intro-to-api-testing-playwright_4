"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const http_status_codes_1 = require("http-status-codes");
const order_dto_1 = require("./Dto/order-dto");
const ajv_1 = __importDefault(require("ajv"));
const order_schema_json_1 = __importDefault(require("./Dto/order-schema.json"));
const serviceURL = 'https://backend.tallinn-learning.ee/test-orders';
// add test describe as test suite
test_1.test.describe('Simple solution API tests', () => {
    (0, test_1.test)('get order with correct id should receive code 200', async ({ request }) => {
        // Build and send a GET request to the server
        const response = await request.get(`${serviceURL}/1`);
        // Log the response status, body and headers
        console.log('response body:', await response.json());
        console.log('response headers:', response.headers());
        (0, test_1.expect)(response.status()).toBe(http_status_codes_1.StatusCodes.OK);
    });
    (0, test_1.test)('post order with correct data should receive code 200', async ({ request }) => {
        // prepare request body with dto pattern
        const requestBody = order_dto_1.OrderDto.createOrderWithRandomData();
        const response = await request.post(serviceURL, {
            data: requestBody,
        });
        test_1.expect.soft(response.status()).toBe(http_status_codes_1.StatusCodes.OK);
        const responseBody = await response.json();
        test_1.expect.soft(responseBody.status).toBe('OPEN');
        test_1.expect.soft(responseBody.courierId).toBeDefined();
        test_1.expect.soft(responseBody.customerName).toBeDefined();
    });
    (0, test_1.test)('post order with correct data should receive code 200 - process full body', async ({ request, }) => {
        // prepare request body with dto pattern
        const requestBody = order_dto_1.OrderDto.createOrderWithRandomData();
        const response = await request.post(serviceURL, {
            data: requestBody,
        });
        test_1.expect.soft(response.status()).toBe(http_status_codes_1.StatusCodes.OK);
        const responseBody = await response.json();
        test_1.expect.soft(responseBody.status).toBe(requestBody.status);
        test_1.expect.soft(responseBody.courierId).toBe(requestBody.courierId);
        test_1.expect.soft(responseBody.customerName).toBe(requestBody.customerName);
        test_1.expect.soft(responseBody.customerPhone).toBe(requestBody.customerPhone);
        test_1.expect.soft(responseBody.comment).toBe(requestBody.comment);
        // match the id with a regular expression
        test_1.expect.soft(String(responseBody.id)).toMatch(/\d+/);
    });
    (0, test_1.test)('validate API response against JSON schema', async ({ request }) => {
        const response = await request.get(`${serviceURL}/1`);
        const responseBody = await response.json();
        // Validate response against the JSON schema
        const ajv = new ajv_1.default();
        const validate = ajv.compile(order_schema_json_1.default);
        const isValid = validate(responseBody);
        // Ensure the response matches the schema
        test_1.expect.soft(isValid).toBe(true);
        // validate the response body
        validateResponseBody(responseBody);
    });
    (0, test_1.test)('post order with unexpected fields should ignore extra fields', async ({ request }) => {
        const requestBody = order_dto_1.OrderDto.createOrderWithRandomData();
        const extendedRequestBody = {
            ...requestBody,
            unexpectedField: 'Extra data',
        };
        const response = await request.post(serviceURL, {
            data: extendedRequestBody,
        });
        const responseBody = await response.json();
        console.log('Response status:', response.status());
        console.log('Response body:', responseBody);
        (0, test_1.expect)(response.status()).toBe(http_status_codes_1.StatusCodes.OK); // Kui server ignoreerib lisavälja
        // Kontrolli, et ootamatu väli poleks vastuses tagasi
        (0, test_1.expect)(responseBody.unexpectedField).toBeUndefined();
    });
    (0, test_1.test)('post order with headers should include headers in response', async ({ request }) => {
        const headers = {
            'Content-Type': 'application/json',
            Api_key: '1234567890123456',
        };
        const requestBody = order_dto_1.OrderDto.createOrderWithRandomData();
        const response = await request.post(serviceURL, {
            headers: headers,
            data: requestBody,
        });
        const responseBody = await response.json();
        console.log('Response status:', response.status());
        console.log('Response body:', responseBody);
        (0, test_1.expect)(response.status()).toBe(http_status_codes_1.StatusCodes.OK);
        // Kontrollime päiseid (kui server vastab päistega)
        (0, test_1.expect)(response.headers()['content-type']).toContain('application/json');
    });
    function validateResponseBody(responseBody) {
        test_1.expect.soft(responseBody.status).toBeDefined();
        test_1.expect.soft(responseBody.courierId).toBeNull();
        test_1.expect.soft(responseBody.customerName).toMatch(/\w+/);
        test_1.expect.soft(responseBody.customerPhone).toMatch(/\w+/);
        test_1.expect.soft(responseBody.comment).toMatch(/\w+/);
        test_1.expect.soft(String(responseBody.id)).toMatch(/\d+/);
    }
});

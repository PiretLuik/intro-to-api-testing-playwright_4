"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const http_status_codes_1 = require("http-status-codes");
const order_dto_1 = require("./Dto/order-dto");
(0, test_1.test)('get order with correct id should receive code 200', async ({ request }) => {
    // Build and send a GET request to the server
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1');
    // Log the response status, body and headers
    console.log('response body:', await response.json());
    console.log('response headers:', response.headers());
    // Check if the response status is 200
    (0, test_1.expect)(response.status()).toBe(200);
});
(0, test_1.test)('post order with correct data should receive code 201', async ({ request }) => {
    const requestBody = order_dto_1.OrderDto.createOrderWithRandomData();
    /*const requestBody = {
      status: 'OPEN',
      courierId: 0,
      customerName: 'string',
      customerPhone: 'string',
      comment: 'string',
      id: 0,
    }*/
    // Send a POST request to the server
    const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
        data: requestBody,
    });
    // Log the response status and body
    console.log('response status:', response.status());
    console.log('response body:', await response.json());
    (0, test_1.expect)(response.status()).toBe(http_status_codes_1.StatusCodes.OK);
    const responseBody = await response.json();
    test_1.expect.soft(responseBody.status).toBe('OPEN');
    test_1.expect.soft(responseBody.courierId).toBeDefined();
    test_1.expect.soft(responseBody.customerName).toBeDefined();
});
(0, test_1.test)('post order with missing fields should return 400', async ({ request }) => {
    const requestBody = {
        status: 'OPEN', // Väli olemas
        courierId: 0, // Väli olemas
        // Puudu: customerName, customerPhone, comment, id
    };
    const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
        data: requestBody,
    });
    console.log('response status:', response.status());
    (0, test_1.expect)(response.status()).toBe(400);
});
(0, test_1.test)('post order with unexpected fields should return 400', async ({ request }) => {
    const requestBody = {
        status: 'OPEN',
        courierId: 1,
        customerName: 'John Doe',
        customerPhone: '+123456789',
        comment: 'Urgent order',
        id: 1,
        unexpectedField: 'This should not be here', // Ootamatu väli
    };
    const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
        data: requestBody,
    });
    console.log('response status:', response.status());
    (0, test_1.expect)(response.status()).toBe(400); // Või 200, kui server lihtsalt ignoreerib lisavälja
});
(0, test_1.test)('post order with invalid values should return 400', async ({ request }) => {
    const requestBody = {
        status: 'OPEN',
        courierId: -1, // Negatiivne ID, peaks ebaõnnestuma
        customerName: '',
        customerPhone: '',
        comment: 'Test order',
        id: -10,
    };
    const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
        data: requestBody,
    });
    console.log('response status:', response.status());
    (0, test_1.expect)(response.status()).toBe(400);
});
(0, test_1.test)('get invalid order ID should return 400', async ({ request }) => {
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/9999');
    console.log('response status:', response.status());
    (0, test_1.expect)(response.status()).toBe(400); // Kontrollime, kas server tagastab "Bad Request"
});
(0, test_1.test)('get non-existent order should return 400', async ({ request }) => {
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1000000');
    console.log('response status (non-existent ID):', response.status());
    (0, test_1.expect)(response.status()).toBe(400); // Kontrollime serveri käitumist
});

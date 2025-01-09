import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './Dto/order-dto'
import Ajv from 'ajv'
import schema from './Dto/order-schema.json'

const serviceURL = 'https://backend.tallinn-learning.ee/test-orders'

// add test describe as test suite
test.describe('Simple solution API tests', () => {
  test('get order with correct id should receive code 200', async ({ request }) => {
    // Build and send a GET request to the server
    const response = await request.get(`${serviceURL}/1`)
    // Log the response status, body and headers
    console.log('response body:', await response.json())
    console.log('response headers:', response.headers())
    expect(response.status()).toBe(StatusCodes.OK)
  })

  test('post order with correct data should receive code 200', async ({ request }) => {
    // prepare request body with dto pattern
    const requestBody = OrderDto.createOrderWithRandomData()
    const response = await request.post(serviceURL, {
      data: requestBody,
    })
    expect.soft(response.status()).toBe(StatusCodes.OK)
    const responseBody = await response.json()
    expect.soft(responseBody.status).toBe('OPEN')
    expect.soft(responseBody.courierId).toBeDefined()
    expect.soft(responseBody.customerName).toBeDefined()
  })

  test('post order with correct data should receive code 200 - process full body', async ({
                                                                                            request,
                                                                                          }) => {
    // prepare request body with dto pattern
    const requestBody = OrderDto.createOrderWithRandomData()
    const response = await request.post(serviceURL, {
      data: requestBody,
    })

    expect.soft(response.status()).toBe(StatusCodes.OK)
    const responseBody = await response.json()
    expect.soft(responseBody.status).toBe(requestBody.status)
    expect.soft(responseBody.courierId).toBe(requestBody.courierId)
    expect.soft(responseBody.customerName).toBe(requestBody.customerName)
    expect.soft(responseBody.customerPhone).toBe(requestBody.customerPhone)
    expect.soft(responseBody.comment).toBe(requestBody.comment)
    // match the id with a regular expression
    expect.soft(String(responseBody.id)).toMatch(/\d+/)
  })

  test('validate API response against JSON schema', async ({ request }) => {
    const response = await request.get(`${serviceURL}/1`)
    const responseBody = await response.json()

    // Validate response against the JSON schema
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const isValid = validate(responseBody)

    // Ensure the response matches the schema
    expect.soft(isValid).toBe(true)
    // validate the response body
    validateResponseBody(responseBody)
  })

  test('post order with unexpected fields should ignore extra fields', async ({ request }) => {
    const requestBody = OrderDto.createOrderWithRandomData()
    const extendedRequestBody = {
      ...requestBody,
      unexpectedField: 'Extra data',
    }

    const response = await request.post(serviceURL, {
      data: extendedRequestBody,
    })

    const responseBody = await response.json()

    console.log('Response status:', response.status())
    console.log('Response body:', responseBody)

    expect(response.status()).toBe(StatusCodes.OK) // Kui server ignoreerib lisavälja
    // Kontrolli, et ootamatu väli poleks vastuses tagasi
    expect(responseBody.unexpectedField).toBeUndefined()
  })
  test('post order with headers should include headers in response', async ({ request }) => {
    const headers = {
      'Content-Type': 'application/json',
      Api_key: '1234567890123456',
    }

    const requestBody = OrderDto.createOrderWithRandomData()

    const response = await request.post(serviceURL, {
      headers: headers,
      data: requestBody,
    })

    const responseBody = await response.json()

    console.log('Response status:', response.status())
    console.log('Response body:', responseBody)

    expect(response.status()).toBe(StatusCodes.OK)
    // Kontrollime päiseid (kui server vastab päistega)
    expect(response.headers()['content-type']).toContain('application/json')
  })
// Test: GET with invalid order ID
  test('get invalid order ID should return 400', async ({ request }) => {
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/9999');
    console.log('Response status:', response.status());
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST); // Expect 400
  });

// Test: GET non-existent order
  test('get non-existent order should return 400', async ({ request }) => {
    const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1000000');
    console.log('Response status (non-existent ID):', response.status());
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST); // Expect 400
  });

  function validateResponseBody(responseBody: OrderDto): void {
    expect.soft(responseBody.status).toBeDefined()
    expect.soft(responseBody.courierId).toBeNull()
    expect.soft(responseBody.customerName).toMatch(/\w+/)
    expect.soft(responseBody.customerPhone).toMatch(/\w+/)
    expect.soft(responseBody.comment).toMatch(/\w+/)
    expect.soft(String(responseBody.id)).toMatch(/\d+/)
  }
})


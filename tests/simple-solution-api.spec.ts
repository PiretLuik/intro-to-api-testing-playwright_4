import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './Dto/order-dto'
import Ajv from 'ajv'
import schema from './Dto/order-schema.json'

const serviceURL: string = 'https://backend.tallinn-learning.ee/test-orders'

// Add test describe as test suite
test.describe('Simple solution API tests', () => {
  test('get order with correct id should receive code 200', async ({ request }): Promise<void> => {
    const response = await request.get(`${serviceURL}/1`)
    const responseBody = await response.json()
    console.log('response body:', responseBody)
    console.log('response headers:', response.headers())
    expect(response.status()).toBe(StatusCodes.OK)
  })

  test('post order with correct data should receive code 200', async ({
    request,
  }): Promise<void> => {
    const requestBody: OrderDto = OrderDto.createOrderWithRandomData()
    const response = await request.post(serviceURL, {
      data: requestBody,
    })
    const responseBody = await response.json()

    console.log('response status:', response.status())
    console.log('response body:', responseBody)

    expect.soft(response.status()).toBe(StatusCodes.OK)
    expect.soft(responseBody.status).toBe('OPEN')
    expect.soft(responseBody.courierId).toBeDefined()
    expect.soft(responseBody.customerName).toBeDefined()
  })

  test('post order with correct data should process full body', async ({
    request,
  }): Promise<void> => {
    const requestBody: OrderDto = OrderDto.createOrderWithRandomData()
    const response = await request.post(serviceURL, { data: requestBody })
    const responseBody = await response.json()

    expect.soft(response.status()).toBe(StatusCodes.OK)
    expect.soft(responseBody.status).toBe(requestBody.status)
    expect.soft(responseBody.courierId).toBe(requestBody.courierId)
    expect.soft(responseBody.customerName).toBe(requestBody.customerName)
    expect.soft(responseBody.customerPhone).toBe(requestBody.customerPhone)
    expect.soft(responseBody.comment).toBe(requestBody.comment)
    expect.soft(String(responseBody.id)).toMatch(/\d+/)
  })

  test('validate API response against JSON schema', async ({ request }): Promise<void> => {
    const response = await request.get(`${serviceURL}/1`)
    const responseBody = await response.json()

    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const isValid: boolean = validate(responseBody)

    expect.soft(isValid).toBe(true)
    validateResponseBody(responseBody)
  })

  test('post order with unexpected fields should ignore extra fields', async ({
    request,
  }): Promise<void> => {
    const requestBody: OrderDto = OrderDto.createOrderWithRandomData()
    const extendedRequestBody = { ...requestBody, unexpectedField: 'Extra data' }
    const response = await request.post(serviceURL, { data: extendedRequestBody })
    const responseBody = await response.json()

    console.log('Response status:', response.status())
    console.log('Response body:', responseBody)

    expect(response.status()).toBe(StatusCodes.OK)
    expect(responseBody.unexpectedField).toBeUndefined()
  })

  test('post order with headers should include headers in response', async ({
    request,
  }): Promise<void> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Api_key: '1234567890123456',
    }

    const requestBody: OrderDto = OrderDto.createOrderWithRandomData()
    const response = await request.post(serviceURL, { headers, data: requestBody })
    const responseBody = await response.json()

    console.log('Response status:', response.status())
    console.log('Response body:', responseBody)

    expect(response.status()).toBe(StatusCodes.OK)
    expect(response.headers()['content-type']).toContain('application/json')
  })

  test('get invalid order ID should return 400', async ({ request }): Promise<void> => {
    const response = await request.get(`${serviceURL}/9999`)
    console.log('Response status:', response.status())
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('get non-existent order should return 400', async ({ request }): Promise<void> => {
    const response = await request.get(`${serviceURL}/1000000`)
    console.log('Response status (non-existent ID):', response.status())
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  function validateResponseBody(responseBody: OrderDto): void {
    expect.soft(responseBody.status).toBeDefined()
    expect.soft(responseBody.courierId).toBeNull()
    expect.soft(responseBody.customerName).toMatch(/\w+/)
    expect.soft(responseBody.customerPhone).toMatch(/\w+/)
    expect.soft(responseBody.comment).toMatch(/\w+/)
    expect.soft(String(responseBody.id)).toMatch(/\d+/)
  }
})

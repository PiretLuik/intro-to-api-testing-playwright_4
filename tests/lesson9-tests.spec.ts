import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

const Url = 'https://backend.tallinn-learning.ee/test-orders'
const orderId = 5 // Order ID võib olla 1..10

// GET päringud
test.describe('Tests for GET request', () => {
  test('positive GET test - Order fetched successfully', async ({ request }) => {
    const response = await request.get(`${Url}/${orderId}`)
    console.log('response status:', response.status())
    expect(response.status()).toBe(StatusCodes.OK) // Status code: 200
  })

  test('test for GET: Bad Request when Id is a negative number', async ({ request }) => {
    const response = await request.get(`${Url}/-1`)
    console.log('response status:', response.status())
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST) // Status code: 400
  })

  test('test for GET: Bad Request when Id has an alphanumeric value', async ({ request }) => {
    const response = await request.get(`${Url}/abc123`)
    console.log('response status:', response.status())
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST) // Status code: 400
  })
})

// POST päringud
test.describe('Tests for POST request', () => {
  test('post order with correct data should receive code 200', async ({ request }) => {
    const requestBody = {
      status: 'OPEN',
      courierId: 0,
      customerName: 'string',
      customerPhone: 'string',
      comment: 'string',
      id: 0,
    }
    const response = await request.post(`${Url}`, { data: requestBody })
    console.log('response status:', response.status())
    expect(response.status()).toBe(StatusCodes.OK) // Status code: 200
  })

  test('post order with incorrect data should receive code 400', async ({ request }) => {
    const requestBody = {
      status: 'CLOSE', // Vale status
      courierId: 0,
      customerName: 'string',
      customerPhone: 'string',
      comment: 'string',
      id: 0,
    }
    const response = await request.post(`${Url}`, { data: requestBody })
    console.log('response status:', response.status())
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST) // Status code: 400
  })
})

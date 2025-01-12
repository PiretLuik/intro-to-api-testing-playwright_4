'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const test_1 = require('@playwright/test')
const http_status_codes_1 = require('http-status-codes')
const order_dto_1 = require('./Dto/order-dto')
;(0, test_1.test)('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')
  // Log the response status, body and headers
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  // Check if the response status is 200
  ;(0, test_1.expect)(response.status()).toBe(200)
})
;(0, test_1.test)('post order with correct data should receive code 201', async ({ request }) => {
  // prepare request body
  const requestBody = order_dto_1.OrderDto.createOrderWithRandomData()
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
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  ;(0, test_1.expect)(response.status()).toBe(http_status_codes_1.StatusCodes.OK)
  const responseBody = await response.json()
  test_1.expect.soft(responseBody.status).toBe('OPEN')
  test_1.expect.soft(responseBody.courierId).toBeDefined()
  test_1.expect.soft(responseBody.customerName).toBeDefined()
})
;(0, test_1.test)('2 post order with correct data should receive code 201', async ({ request }) => {
  // prepare headers
  const headers = {
    'Content-Type': 'application/json',
    Api_key: '1234567890123456',
  }
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders/', {
    headers: headers,
    data: requestBody,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  ;(0, test_1.expect)(response.status()).toBe(http_status_codes_1.StatusCodes.OK)
  //const responseBody = await response.json()
  //expect.soft(responseBody.status).toBe('OPEN')
  //expect.soft(responseBody.courierId).toBeDefined()
  //expect.soft(responseBody.customerName).toBeDefined()
})

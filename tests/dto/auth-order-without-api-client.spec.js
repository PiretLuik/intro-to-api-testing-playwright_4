'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const test_1 = require('@playwright/test')
const login_dto_1 = require('./login-dto')
const order_dto_1 = require('./order-dto')
const http_status_codes_1 = require('http-status-codes')
const BaseUrl = 'https://backend.tallinn-learning.ee'
const LoginEndPoint = '/login/student'
const OrdersEndPoint = '/orders'
;(0, test_1.test)('login and create order without api client', async ({ request }) => {
  test_1.test.setTimeout(60000) // Suurendame ajalimiiti, et vältida ootamatut timeouti.
  console.log('Starting login and create order without ApiClient...')
  try {
    // Login
    const loginResponse = await request.post(`${BaseUrl}${LoginEndPoint}`, {
      data: login_dto_1.LoginDto.createLoginWithCorrectData(),
      timeout: 10000, // Timeout 10 sekundit
    })
    console.log('Login Response Headers:', loginResponse.headers())
    console.log('Login Response Body:', await loginResponse.text())
    const jwt = await loginResponse.text()
    console.log('Login response status:', loginResponse.status())
    console.log('JWT received:', jwt)
    ;(0, test_1.expect)(loginResponse.status()).toBe(http_status_codes_1.StatusCodes.OK)
    // Create order
    const createOrderResponse = await request.post(`${BaseUrl}${OrdersEndPoint}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      data: order_dto_1.OrderDto.createOrderWithRandomData(),
      timeout: 10000, // Timeout 10 sekundit
    })
    console.log('Create order response status:', createOrderResponse.status())
    console.log('Create order response body:', await createOrderResponse.text())
    const order = await createOrderResponse.json()
    console.log('Order created:', order)
    ;(0, test_1.expect)(createOrderResponse.status()).toBe(http_status_codes_1.StatusCodes.OK)
    test_1.expect.soft(order).toHaveProperty('status', order.status)
    test_1.expect.soft(order).toHaveProperty('customerName', order.customerName)
    test_1.expect.soft(order).toHaveProperty('id', order.id)
  } catch (error) {
    console.error('Error in login and create order test:', error)
    throw error
  }
})
;(0, test_1.test)('login and get order without api client', async ({ request }) => {
  test_1.test.setTimeout(60000)
  console.log('Starting login and get order without ApiClient...')
  try {
    // Login
    const loginResponse = await request.post(`${BaseUrl}${LoginEndPoint}`, {
      data: login_dto_1.LoginDto.createLoginWithCorrectData(),
      timeout: 10000,
    })
    console.log('Login Response Headers:', loginResponse.headers())
    console.log('Login Response Body:', await loginResponse.text())
    const jwt = await loginResponse.text()
    console.log('Login response status:', loginResponse.status())
    console.log('JWT received:', jwt)
    ;(0, test_1.expect)(loginResponse.status()).toBe(http_status_codes_1.StatusCodes.OK)
    // Create order
    const createOrderResponse = await request.post(`${BaseUrl}${OrdersEndPoint}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      data: order_dto_1.OrderDto.createOrderWithRandomData(),
      timeout: 10000,
    })
    console.log('Create order response status:', createOrderResponse.status())
    console.log('Create order response body:', await createOrderResponse.text())
    const order = await createOrderResponse.json()
    console.log('Order created:', order)
    ;(0, test_1.expect)(createOrderResponse.status()).toBe(http_status_codes_1.StatusCodes.OK)
    const orderId = order.id
    // Get order
    const getOrderResponse = await request.get(`${BaseUrl}${OrdersEndPoint}/${orderId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      timeout: 10000,
    })
    console.log('Get order response status:', getOrderResponse.status())
    console.log('Get order response body:', await getOrderResponse.text())
    const receivedOrder = await getOrderResponse.json()
    console.log('Order fetched:', receivedOrder)
    ;(0, test_1.expect)(getOrderResponse.status()).toBe(http_status_codes_1.StatusCodes.OK)
    ;(0, test_1.expect)(receivedOrder.id).toBe(orderId)
  } catch (error) {
    console.error('Error in login and get order test:', error)
    throw error
  }
})
;(0, test_1.test)('login and delete order without api client', async ({ request }) => {
  test_1.test.setTimeout(60000)
  console.log('Starting login and delete order without ApiClient...')
  try {
    // Login
    const loginResponse = await request.post(`${BaseUrl}${LoginEndPoint}`, {
      data: login_dto_1.LoginDto.createLoginWithCorrectData(),
      timeout: 10000,
    })
    console.log('Login Response Headers:', loginResponse.headers())
    console.log('Login Response Body:', await loginResponse.text())
    const jwt = await loginResponse.text()
    console.log('Login response status:', loginResponse.status())
    console.log('JWT received:', jwt)
    ;(0, test_1.expect)(loginResponse.status()).toBe(http_status_codes_1.StatusCodes.OK)
    // Create order
    const createOrderResponse = await request.post(`${BaseUrl}${OrdersEndPoint}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      data: order_dto_1.OrderDto.createOrderWithRandomData(),
      timeout: 10000,
    })
    console.log('Create order response status:', createOrderResponse.status())
    console.log('Create order response body:', await createOrderResponse.text())
    const order = await createOrderResponse.json()
    console.log('Order created:', order)
    ;(0, test_1.expect)(createOrderResponse.status()).toBe(http_status_codes_1.StatusCodes.OK)
    const orderId = order.id
    // Delete order
    const deleteOrderResponse = await request.delete(`${BaseUrl}${OrdersEndPoint}/${orderId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      timeout: 10000,
    })
    console.log('Delete order response status:', deleteOrderResponse.status())
    console.log('Delete order response body:', await deleteOrderResponse.text())
    const deletedOrder = await deleteOrderResponse.json()
    console.log('Order deleted:', deletedOrder)
    ;(0, test_1.expect)(deleteOrderResponse.status()).toBe(http_status_codes_1.StatusCodes.OK)
    ;(0, test_1.expect)(deletedOrder).toBeTruthy()
  } catch (error) {
    console.error('Error in login and delete order test:', error)
    throw error
  }
})

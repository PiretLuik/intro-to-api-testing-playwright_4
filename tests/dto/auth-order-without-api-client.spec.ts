import { expect, test } from '@playwright/test'
import { LoginDto } from './login-dto'
import { OrderDto } from './order-dto'
import { StatusCodes } from 'http-status-codes'

const BaseUrl = 'https://backend.tallinn-learning.ee'
const LoginEndPoint = '/login/student'
const OrdersEndPoint = '/orders'

test('login and create order without api client', async ({ request }) => {
  //login
  const loginResponse = await request.post(`${BaseUrl}${LoginEndPoint}`, {
    data: LoginDto.createLoginWithCorrectData(),
  })
  const jwt = await loginResponse.text() //response body contains jwt
  expect(loginResponse.status()).toBe(StatusCodes.OK) // code 200

  //create order with random data
  const createOrderResponse = await request.post(`${BaseUrl}${OrdersEndPoint}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    data: OrderDto.createOrderWithRandomData(),
  })

  const order = await createOrderResponse.json()
  console.log(order)
  expect(createOrderResponse.status()).toBe(StatusCodes.OK)
  expect.soft(order).toHaveProperty('status', order.status)
  expect.soft(order).toHaveProperty('customerName', order.customerName)
  expect.soft(order).toHaveProperty('id', order.id)
})

test('login and get order without api client', async ({ request }) => {
  //login
  const loginResponse = await request.post(`${BaseUrl}${LoginEndPoint}`, {
    data: LoginDto.createLoginWithCorrectData(),
  })
  const jwt = await loginResponse.text() //response body contains jwt
  expect(loginResponse.status()).toBe(StatusCodes.OK) // code 200

  //create order with random data
  const createOrderResponse = await request.post(`${BaseUrl}${OrdersEndPoint}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    data: OrderDto.createOrderWithRandomData(),
  })

  const order = await createOrderResponse.json()
  console.log(order)
  expect(createOrderResponse.status()).toBe(StatusCodes.OK)
  expect.soft(order).toHaveProperty('id', order.id)
  const orderId = order.id

  //get order by id
  const getOrderResponse = await request.get(`${BaseUrl}${OrdersEndPoint}/${orderId}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })

  expect(getOrderResponse.status()).toBe(StatusCodes.OK)
  const receivedOrder = await getOrderResponse.json()
  console.log(receivedOrder)
  expect(receivedOrder.id).toBe(orderId)
})

test('login and delete order without api client', async ({ request }) => {
  // login
  const loginResponse = await request.post(`${BaseUrl}${LoginEndPoint}`, {
    data: LoginDto.createLoginWithCorrectData(),
  })
  const jwt = await loginResponse.text() // response body contains jwt
  expect(loginResponse.status()).toBe(StatusCodes.OK) // code 200

  // create order with random data
  const createOrderResponse = await request.post(`${BaseUrl}${OrdersEndPoint}`, {
    headers: { Authorization: `Bearer ${jwt}` },
    data: OrderDto.createOrderWithRandomData(),
  })

  const order = await createOrderResponse.json()
  console.log(order)
  expect(createOrderResponse.status()).toBe(StatusCodes.OK)
  expect.soft(order).toHaveProperty('id', order.id)
  const orderId = order.id

  // delete order by id
  const deleteOrderResponse = await request.delete(`${BaseUrl}${OrdersEndPoint}/${orderId}`, {
    headers: { Authorization: `Bearer ${jwt}` },
  })
  expect(deleteOrderResponse.status()).toBe(StatusCodes.OK)
  const deletedOrder = await deleteOrderResponse.json()
  console.log(deletedOrder)

  expect(deletedOrder).toBeTruthy()
})

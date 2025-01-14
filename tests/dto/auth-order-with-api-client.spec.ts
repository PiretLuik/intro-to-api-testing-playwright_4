import { test } from '@playwright/test'
import { ApiClient } from '../api/api-client'

let orderId: number

test('verify createOrderAndReturnOrderId exists', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  if (typeof apiClient.createOrderAndReturnOrderId !== 'function') {
    throw new Error('createOrderAndReturnOrderId is not a function')
  }
})

test('login and create order with api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  try {
    orderId = await apiClient.createOrderAndReturnOrderId()
    console.log('orderId:', orderId)
  } catch (error) {
    console.error('Error during order creation:', error)
  }
})

test('login and get order with api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  try {
    orderId = await apiClient.createOrderAndReturnOrderId()
    await apiClient.getOrderById(orderId)
  } catch (error) {
    console.error('Error during getting order:', error)
  }
})

test('login and delete order with api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  try {
    orderId = await apiClient.createOrderAndReturnOrderId()
    await apiClient.deleteOrderById(orderId)
  } catch (error) {
    console.error('Error during order deletion:', error)
  }
})

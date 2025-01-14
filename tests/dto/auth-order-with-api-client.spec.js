'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const test_1 = require('@playwright/test')
const api_client_1 = require('../api/api-client')
let apiClientInstance // Globaalne ApiClient-eksemplar
let orderId
// Globaalne seadistus, et initsialiseerida ApiClient eksemplar
test_1.test.beforeAll(async ({ request }) => {
  console.log('Seadistan ApiClienti eksemplari...')
  try {
    // Loo ApiClienti eksemplar, edastades request objekti (eeldame, et ApiClient käsitseb ise JWT-d)
    apiClientInstance = await api_client_1.ApiClient.getInstance(request)
    console.log('ApiClient eksemplar edukalt initsialiseeritud.')
  } catch (error) {
    console.error('Viga ApiClient eksemplari initsialiseerimisel:', error)
    throw error
  }
})
// Kontrolli testsenaarium: tagab, et `createOrderAndReturnOrderId` eksisteerib
;(0, test_1.test)('verify createOrderAndReturnOrderId exists', async () => {
  console.log('Starting test to verify createOrderAndReturnOrderId function...')
  try {
    ;(0, test_1.expect)(typeof apiClientInstance.createOrderAndReturnOrderId).toBe('function')
    console.log('Function createOrderAndReturnOrderId exists.')
  } catch (error) {
    console.error('Error in verify createOrderAndReturnOrderId exists test:', error)
    throw error
  }
})
// Autentimine ja tellimuse loomine
;(0, test_1.test)('login and create order with api client', async () => {
  console.log('Starting login and create order test...')
  try {
    orderId = await apiClientInstance.createOrderAndReturnOrderId()
    console.log('Order ID created:', orderId)
    ;(0, test_1.expect)(orderId).toBeGreaterThan(0) // Kontrolli, et Order ID on realistiline
  } catch (error) {
    console.error('Error during order creation:', error)
    throw error
  }
})
// Autentimine ja tellimuse pärimine
;(0, test_1.test)('login and get order with api client', async () => {
  console.log('Starting login and get order test...')
  try {
    if (!orderId) {
      orderId = await apiClientInstance.createOrderAndReturnOrderId() // Vajadusel loo uus tellimus
      console.log('Order ID created for fetch:', orderId)
    }
    const order = await apiClientInstance.getOrderById(orderId)
    console.log('Order fetched successfully:', order)
    ;(0, test_1.expect)(order).toBeDefined() // Kontrolli, et tellimuse andmed ei ole `undefined`
  } catch (error) {
    console.error('Error during order fetch:', error)
    throw error
  }
})
// Autentimine ja tellimuse kustutamine
;(0, test_1.test)('login and delete order with api client', async () => {
  console.log('Starting login and delete order test...')
  try {
    if (!orderId) {
      orderId = await apiClientInstance.createOrderAndReturnOrderId() // Vajadusel loo uus tellimus
      console.log('Order ID created for deletion:', orderId)
    }
    await apiClientInstance.deleteOrderById(orderId)
    console.log('Order deleted successfully for ID:', orderId)
    // Kinnita, et tellimus enam ei eksisteeri (catch loogika abil)
    await apiClientInstance.getOrderById(orderId).catch((error) => {
      ;(0, test_1.expect)(error.message).toContain('Order not found') // Kontrollime, et peale kustutamist ei leitud tellimust
    })
    console.log('Verified deletion of order')
  } catch (error) {
    console.error('Error during order deletion:', error)
    throw error
  }
})

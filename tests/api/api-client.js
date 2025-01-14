'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ApiClient = void 0
const login_dto_1 = require('../dto/login-dto')
const http_status_codes_1 = require('http-status-codes')
const test_1 = require('@playwright/test')
const order_dto_1 = require('../dto/order-dto')
const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'
class ApiClient {
  static instance
  request
  jwt = ''
  constructor(request) {
    this.request = request
  }
  static async getInstance(request) {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(request)
      await this.instance.requestJwt()
    }
    return ApiClient.instance
  }
  async requestJwt() {
    console.log('Requesting JWT...')
    try {
      const authResponse = await this.request.post(`${serviceURL}${loginPath}`, {
        data: login_dto_1.LoginDto.createLoginWithCorrectData(),
      })
      console.log('Login response status:', authResponse.status())
      if (authResponse.status() !== http_status_codes_1.StatusCodes.OK) {
        const responseBody = await authResponse.text()
        console.error('Authorization failed:', responseBody)
        throw new Error(`Request failed with status ${authResponse.status()}`)
      }
      this.jwt = await authResponse.text()
      console.log('JWT received:', this.jwt)
    } catch (error) {
      console.error('Error while requesting JWT:', error)
      throw error
    }
  }
  async createOrderAndReturnOrderId() {
    console.log('Creating order...')
    try {
      const response = await this.request.post(`${serviceURL}${orderPath}`, {
        data: order_dto_1.OrderDto.createOrderWithRandomData(),
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
      })
      console.log('Create order response status:', response.status())
      if (response.status() !== http_status_codes_1.StatusCodes.OK) {
        const responseBody = await response.text()
        console.error('Failed to create order:', responseBody)
        throw new Error(`Create order failed with status ${response.status()}`)
      }
      const responseBody = await response.json()
      console.log('Order created:', responseBody)
      return responseBody.id
    } catch (error) {
      console.error('Error while creating order:', error)
      throw error
    }
  }
  async getOrderById(orderId) {
    console.log(`Fetching order with ID ${orderId}...`)
    try {
      const response = await this.request.get(`${serviceURL}${orderPath}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
      })
      console.log('Get order response status:', response.status())
      if (response.status() !== http_status_codes_1.StatusCodes.OK) {
        const responseBody = await response.text()
        console.error('Failed to fetch order:', responseBody)
        throw new Error(`Get order failed with status ${response.status()}`)
      }
      const responseBody = await response.json()
      console.log('Order fetched:', responseBody)
      ;(0, test_1.expect)(responseBody.id).toBe(orderId)
    } catch (error) {
      console.error(`Error while fetching order with ID ${orderId}:`, error)
      throw error
    }
  }
  async deleteOrderById(orderId) {
    console.log(`Deleting order with ID ${orderId}...`)
    try {
      const response = await this.request.delete(`${serviceURL}${orderPath}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
      })
      console.log('Delete order response status:', response.status())
      if (response.status() !== http_status_codes_1.StatusCodes.OK) {
        const responseBody = await response.text()
        console.error('Failed to delete order:', responseBody)
        throw new Error(`Delete order failed with status ${response.status()}`)
      }
      const responseBody = await response.json()
      console.log('Order deleted:', responseBody)
      ;(0, test_1.expect)(responseBody).toBeTruthy()
    } catch (error) {
      console.error(`Error while deleting order with ID ${orderId}:`, error)
      throw error
    }
  }
}
exports.ApiClient = ApiClient

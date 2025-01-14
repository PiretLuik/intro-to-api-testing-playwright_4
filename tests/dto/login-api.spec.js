'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const test_1 = require('@playwright/test')
const login_dto_1 = require('./login-dto')
const http_status_codes_1 = require('http-status-codes')
const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const jwtFormat = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/ // JWT regex
test_1.test.describe('Tallinn delivery API tests', () => {
  ;(0, test_1.test)('login with correct data and validate JWT', async ({ request }) => {
    const requestBody = login_dto_1.LoginDto.createLoginWithCorrectData()
    const response = await request.post(`${serviceURL}${loginPath}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    })
    console.log('Response status:', response.status())
    const responseBody = await response.text()
    console.log('Response body:', responseBody)
    ;(0, test_1.expect)(response.status(), 'Expected HTTP status 200').toBe(
      http_status_codes_1.StatusCodes.OK,
    )
    ;(0, test_1.expect)(responseBody, 'Expected response body to match JWT format').toMatch(
      jwtFormat,
    )
    const tokenParts = responseBody.split('.')
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
    ;(0, test_1.expect)(payload.exp, 'Expected token to have expiration time').toBeGreaterThan(
      Date.now() / 1000,
    )
    ;(0, test_1.expect)(payload.sub, 'Expected token subject to match username').toBe(
      process.env.USER,
    )
  })
  ;(0, test_1.test)('login with incorrect data should fail', async ({ request }) => {
    const requestBody = login_dto_1.LoginDto.createLoginWithIncorrectData()
    const response = await request.post(`${serviceURL}${loginPath}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    })
    console.log('Response status:', response.status())
    const responseBody = await response.text()
    console.log('Response body:', responseBody)
    ;(0, test_1.expect)(response.status(), 'Expected HTTP status 401').toBe(
      http_status_codes_1.StatusCodes.UNAUTHORIZED,
    )
    ;(0, test_1.expect)(responseBody, 'Expected response body to be empty').toBe('')
  })
  ;(0, test_1.test)('login with incorrect HTTP method', async ({ request }) => {
    const requestBody = login_dto_1.LoginDto.createLoginWithCorrectData()
    const response = await request.put(`${serviceURL}${loginPath}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    })
    console.log('Response status:', response.status())
    const responseBody = await response.json()
    console.log('Response body:', responseBody)
    ;(0, test_1.expect)(response.status(), 'Expected HTTP status 405').toBe(
      http_status_codes_1.StatusCodes.METHOD_NOT_ALLOWED,
    )
    ;(0, test_1.expect)(
      responseBody,
      'Expected response body to have error property',
    ).toHaveProperty('error', 'Method Not Allowed')
    ;(0, test_1.expect)(
      responseBody,
      'Expected response body to have status property',
    ).toHaveProperty('status', 405)
  })
})

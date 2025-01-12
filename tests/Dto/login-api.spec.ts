import { expect, test } from '@playwright/test'
import { LoginDto } from './login-dto'
import { StatusCodes } from 'http-status-codes'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const jwtFormat = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/ // JWT regex

test.describe('Tallinn delivery API tests', () => {
  test('login with correct data and validate JWT', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()

    const response = await request.post(`${serviceURL}${loginPath}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    })

    console.log('Response status:', response.status())
    const responseBody = await response.text()
    console.log('Response body:', responseBody)

    // Kontrollime vastuse staatust
    expect(response.status(), 'Expected HTTP status 200').toBe(StatusCodes.OK)

    // Kontrollime JWT tokeni formaati
    expect(responseBody, 'Expected response body to match JWT format').toMatch(jwtFormat)

    // Kontrollime tokeni aegumisaega
    const tokenParts = responseBody.split('.')
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
    expect(payload.exp, 'Expected token to have expiration time').toBeGreaterThan(Date.now() / 1000)
    expect(payload.sub, 'Expected token subject to match username').toBe(process.env.USER)
  })

  test('login with incorrect data should fail', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithIncorrectData()

    const response = await request.post(`${serviceURL}${loginPath}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    })

    console.log('Response status:', response.status())
    const responseBody = await response.text()
    console.log('Response body:', responseBody)

    // Kontrollime vastuse staatust ja tühja keha
    expect(response.status(), 'Expected HTTP status 401').toBe(StatusCodes.UNAUTHORIZED)
    expect(responseBody, 'Expected response body to be empty').toBe('')
  })

  test('login with incorrect HTTP method', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()

    const response = await request.put(`${serviceURL}${loginPath}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    })

    console.log('Response status:', response.status())
    const responseBody = await response.json()
    console.log('Response body:', responseBody)

    // Kontrollime veateadet ja staatust
    expect(response.status(), 'Expected HTTP status 405').toBe(StatusCodes.METHOD_NOT_ALLOWED)
    expect(responseBody, 'Expected response body to have error property').toHaveProperty(
      'error',
      'Method Not Allowed',
    )
    expect(responseBody, 'Expected response body to have status property').toHaveProperty(
      'status',
      405,
    )
  })
})

import { expect, test } from '@playwright/test'
import { LoginDto } from './login-dto'
import { StatusCodes } from 'http-status-codes'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const jwtFormat = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/

test.describe('Tallinn delivery API tests', () => {
  test('login with correct data', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()

    // Debugging: Log request details
    console.log('Request Body:', requestBody)

    const response = await request.post(`${serviceURL}${loginPath}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    })

    const responseStatus = response.status()
    const responseBody = await response.text()

    // Debugging: Log response details
    console.log('Response Status:', responseStatus)
    console.log('Response Body:', responseBody)

    // Include more detailed error handling
    if (responseStatus === StatusCodes.UNAUTHORIZED) {
      console.error('Invalid credentials provided. Status:', responseStatus)
      console.error('Response Body:', responseBody)
    } else if (responseStatus !== StatusCodes.OK) {
      console.error('Unexpected response received. Status:', responseStatus)
      console.error('Response Body:', responseBody)
    }

    expect(responseStatus).toBe(StatusCodes.OK)
    expect(responseBody).toMatch(jwtFormat)
  })

  test('login with incorrect data', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithIncorrectData()

    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })

    const responseBody = await response.text()

    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
    expect(responseBody).toBe('')
  })

  test('login with any incorrect HTTP method', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithIncorrectData()

    const response = await request.put(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })

    const responseBody = await response.json()

    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
    expect.soft(responseBody).toHaveProperty('error', 'Method Not Allowed')
    expect.soft(responseBody).toHaveProperty('status', 405)
  })

  test('login with another incorrect HTTP method (PATCH)', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()

    const response = await request.patch(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })

    const responseBody = await response.json()

    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
    expect(responseBody).toHaveProperty('error', 'Method Not Allowed')
  })
})

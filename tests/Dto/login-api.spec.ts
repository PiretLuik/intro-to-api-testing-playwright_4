import { expect, test } from '@playwright/test'
import { LoginDto } from './login-dto'
import { StatusCodes } from 'http-status-codes'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const jwtFormat = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/ // JWT formaadi regex

test.describe('Tallinn delivery API tests', () => {
  test('login with correct data', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()

    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })

    const responseBody = await response.text()
    console.log('Response body:', responseBody)

    // Kontrollime vastuse staatust ja JWT formaati
    expect(response.status()).toBe(StatusCodes.OK)
    expect(responseBody).toMatch(jwtFormat)
  })

  test('login with incorrect data', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithIncorrectData()

    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })

    const responseBody = await response.text()
    console.log('Response body:', responseBody)

    // Kontrollime vastuse staatust ja tühja keha
    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
    expect(responseBody).toBe('')
  })

  test('login with any incorrect HTTP method', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()

    const response = await request.put(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })

    const responseBody = await response.json()
    console.log('Response body:', responseBody)

    // Kontrollime vastuse staatust ja veateadet
    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
    expect.soft(responseBody).toHaveProperty('error', 'Method Not Allowed')
    expect.soft(responseBody).toHaveProperty('status', 405)
  })
})

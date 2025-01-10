import { expect, test } from '@playwright/test';
import { LoginDto } from './login-dto';

const serviceURL = 'https://backend.tallinn-learning.ee/';
const loginPath = 'login/student';

test.describe('Tallinn delivery API tests', (): void => {
  test('login with correct data', async ({ request }): Promise<void> => {
    // Prepare login request body
    const requestBody = LoginDto.createLoginWithCorrectData();

    // Send POST request
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    });

    // Validate response status code
    expect(response.status()).toBe(200);
  });
});
test.describe('Tallinn delivery API tests', (): void => {
  test('login with incorrect data', async ({ request }): Promise<void> => {
    // Prepare login request body
    const requestBody = LoginDto.createLoginWithIncorrectData();

    // Send POST request
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    });

    // Validate response status code
    expect(response.status()).toBe(401);
  });
});


import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Laadime keskkonnamuutujad failist .env
dotenv.config();

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Number of workers to use for testing */
  workers: process.env.CI ? 1 : 2,
  /* HTML reporter for visual output */
  reporter: [
    ['html', { open: 'never' }], // "always", "on-failure", "never"
    ['list'], // Lisatud list formaadis logi
  ],
  use: {
    /* Enable tracing on every run */
    trace: 'on', // "on", "retain-on-failure", "on-first-retry"
    /* Take a screenshot on failure */
    screenshot: 'only-on-failure', // "on", "off", "only-on-failure"
    /* Record a video on failure */
    video: 'retain-on-failure', // "on", "retain-on-failure", "off"
    /* Set base URL for tests if needed */
    baseURL: process.env.BASE_URL || 'https://backend.tallinn-learning.ee/',
    /* Set headless mode */
    headless: true, // Võid muuta false, kui vaja GUI-d näha
    /* Common HTTP headers */
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  projects: [
    {
      name: 'API tests',
      use: {
        // Eraldi seaded API testidele
        baseURL: process.env.BASE_URL || 'https://backend.tallinn-learning.ee/',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
      },
    },
    {
      name: 'Mobile tests',
      use: {
        ...devices['Pixel 5'], // Lisame mobiilse seadme seadistuse
        headless: true,
      },
    },
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'], // Chrome'i kasutamine
        headless: false,
      },
    },
  ],
});


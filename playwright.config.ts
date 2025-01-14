import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Laadime keskkonnamuutujad failist .env
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    trace: 'retain-on-failure', // Trace-failid luuakse ainult rikete korral
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'https://backend.tallinn-learning.ee/',
    headless: true,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  projects: [
    {
      name: 'API tests',
      use: {
        baseURL: process.env.BASE_URL || 'https://backend.tallinn-learning.ee/',
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
        trace: 'on', // Trace-failid luuakse alati
      },
    },
    {
      name: 'Mobile tests',
      use: {
        ...devices['Pixel 5'],
        headless: true,
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        trace: 'retain-on-failure',
      },
    },
  ],
  outputDir: './test-results', // Kõik tulemused salvestatakse siia kausta
});



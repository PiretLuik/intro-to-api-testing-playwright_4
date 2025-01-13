import { APIRequestContext } from 'playwright';
import { LoginDto } from '../dto/login-dto';
import { OrderDto } from '../dto/order-dto';
import { StatusCodes } from 'http-status-codes';

const BASE_URL = 'https://backend.tallinn-learning.ee/';
const LOGIN_ENDPOINT = 'login/student';
const ORDER_ENDPOINT = 'orders';

export class ApiClient {
  private static instance: ApiClient;
  private request: APIRequestContext;
  private jwt: string = '';

  private constructor(request: APIRequestContext) {
    this.request = request;
  }

  public static async getInstance(request: APIRequestContext): Promise<ApiClient> {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(request);
      await ApiClient.instance.authenticate();
    }
    return ApiClient.instance;
  }

  private async authenticate(): Promise<void> {
    const response = await this.request.post(`${BASE_URL}${LOGIN_ENDPOINT}`, {
      data: LoginDto.createLoginWithCorrectData(),
    });

    if (response.status() !== StatusCodes.OK) {
      throw new Error(`Login failed with status ${response.status()}`);
    }

    this.jwt = await response.text();
  }

  public async createOrder(): Promise<number> {
    const response = await this.request.post(`${BASE_URL}${ORDER_ENDPOINT}`, {
      headers: { Authorization: `Bearer ${this.jwt}` },
      data: OrderDto.createOrderWithRandomData(),
    });

    if (response.status() !== StatusCodes.OK) {
      throw new Error(`Order creation failed with status ${response.status()}`);
    }

    const responseBody = await response.json();
    return responseBody.id;
  }

  public async getOrder(orderId: number): Promise<void> {
    const response = await this.request.get(`${BASE_URL}${ORDER_ENDPOINT}/${orderId}`, {
      headers: { Authorization: `Bearer ${this.jwt}` },
    });

    if (response.status() !== StatusCodes.OK) {
      throw new Error(`Failed to fetch order with status ${response.status()}`);
    }

    const responseBody = await response.json();
    if (responseBody.id !== orderId) {
      throw new Error(`Order ID mismatch: expected ${orderId}, got ${responseBody.id}`);
    }
  }

  public async deleteOrder(orderId: number): Promise<void> {
    const response = await this.request.delete(`${BASE_URL}${ORDER_ENDPOINT}/${orderId}`, {
      headers: { Authorization: `Bearer ${this.jwt}` },
    });

    if (response.status() !== StatusCodes.OK) {
      throw new Error(`Failed to delete order with status ${response.status()}`);
    }
  }
}

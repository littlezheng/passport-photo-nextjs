export class HttpService {
  baseURL: string;
  timeoutSeconds: number;
  idToken?: string;

  constructor(baseURL: string, timeoutSeconds: number = 60) {
    this.baseURL = baseURL;
    this.timeoutSeconds = timeoutSeconds;
  }

  // Update idToken
  public setIdToken(token: string | undefined) {
    this.idToken = token;
  }

  // Create timeout controller
  private createTimeoutController(): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeoutSeconds * 1000);
    return controller;
  }

  // Build URL with baseURL
  private buildUrl(endpoint: string): string {
    if (
      this.baseURL?.startsWith("http://") ||
      this.baseURL?.startsWith("https://")
    ) {
      return `${this.baseURL}${endpoint}`;
    }
    return endpoint;
  }

  // Core request method
  private async request(
    method: string,
    endpoint: string,
    headers?: Record<string, string>,
    body?: BodyInit,
  ): Promise<Response> {
    const controller = this.createTimeoutController();
    const url = this.buildUrl(endpoint);

    let reqHeaders: Record<string, string> = {};
    if (headers) {
      reqHeaders = {
        ...reqHeaders,
        ...headers,
      };
    }
    if (this.idToken) {
      reqHeaders.Authorization = `Bearer ${this.idToken}`;
    }

    const config: RequestInit = {
      method,
      body,
      headers: reqHeaders,
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          `Request timed out after ${this.timeoutSeconds} seconds`,
        );
      }
      throw error;
    }
  }

  // HTTP Methods
  public async get<T>(endpoint: string): Promise<T> {
    const response = await this.request("GET", endpoint);
    return response.json() as T;
  }

  public async post<T>(endpoint: string, body: object): Promise<T> {
    const response = await this.request(
      "POST",
      endpoint,
      { "Content-Type": "application/json" },
      JSON.stringify(body),
    );
    return response.json() as T;
  }

  public async postFormData<T>(endpoint: string, body: FormData): Promise<T> {
    const response = await this.request("POST", endpoint, {}, body);
    return response.json() as T;
  }

  public async put<T>(endpoint: string, body: object): Promise<T> {
    const response = await this.request(
      "PUT",
      endpoint,
      { "Content-Type": "application/json" },
      JSON.stringify(body),
    );
    return response.json() as T;
  }

  public async delete(endpoint: string): Promise<void> {
    await this.request("DELETE", endpoint);
  }
}

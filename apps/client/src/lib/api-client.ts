export class ApiError extends Error {
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = '/api/v1') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...customConfig } = options;

    let url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const config: RequestInit = {
      ...customConfig,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      // Automatically send and receive HTTP-only cookies
      credentials: 'include',
    };

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (err) {
      throw new ApiError(
        0,
        'Network error or server unreachable. Please check your connection.',
        err,
      );
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data: unknown = isJson ? await response.json() : null;

    if (!response.ok) {
      let errorMessage = 'An unexpected error occurred';
      if (data && typeof data === 'object' && 'message' in data) {
        const msg = (data as Record<string, unknown>)['message'];
        if (Array.isArray(msg)) {
          errorMessage = msg.map(String).join(', ');
        } else if (typeof msg === 'string') {
          errorMessage = msg;
        }
      }
      throw new ApiError(response.status, errorMessage, data);
    }

    return data as T;
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

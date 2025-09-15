import { CustomError, HTTPError, NetworkError } from "./errors";

import { getErrorFromResponseData, getStatusCodeErrorMessage } from "./http";

export type APIClientOptions = RequestInit & {
  baseURL?: string;
  noBaseURL?: boolean;
  authRetries?: number;
  withCredentials?: boolean;
  timeout?: number;
  retries?: number;
};

export class APIClient {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  _getRequestUrl(endpoint: string, options?: APIClientOptions) {
    if (options?.noBaseURL) {
      return endpoint;
    }

    const baseUrl = options?.baseURL ?? this.baseURL;

    if (!endpoint.startsWith("/")) {
      return `${baseUrl}/${endpoint}`;
    }

    return `${baseUrl}${endpoint}`;
  }

  async _getResponseErrors(response: Response) {
    const statusError = getStatusCodeErrorMessage(response.status);
    try {
      const data = await response.json();
      const responseError = getErrorFromResponseData(data);
      if (!responseError) {
        return statusError;
      }

      return responseError;
    } catch (error) {
      return statusError;
    }
  }

  async fetch(url: string, options?: APIClientOptions) {
    const timeout = options?.timeout || 30000; // 30 seconds default
    const retries = options?.retries || 3;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorMessage = await this._getResponseErrors(response);
          throw new HTTPError(errorMessage, response.status);
        }

        return response;
      } catch (error: any) {
        clearTimeout(timeoutId);
        
        if (error.name === "AbortError") {
          if (attempt === retries) {
            throw new CustomError("Request timeout - please try again");
          }
          continue; // Retry on timeout
        } else if (error.name === "SyntaxError" || error.name === "TypeError") {
          throw new CustomError("Oops! Looks like the client is having issues");
        }

        if (error.name === "NetworkError") {
          if (attempt === retries) {
            throw new NetworkError(
              "Network error, check your internet connection and try again"
            );
          }
          continue; // Retry on network error
        } else if (error.name === "SecurityError") {
          throw new NetworkError(
            "We are having issues connecting to the server. Please try again later"
          );
        }

        if (error instanceof CustomError || error instanceof HTTPError) {
          throw error;
        }

        if (attempt === retries) {
          throw new CustomError("Oops! looks like something went wrong");
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  async get(endpoint: string, options?: APIClientOptions) {
    const requestUrl = this._getRequestUrl(endpoint, options);

    return this.fetch(requestUrl, {
      ...options,
      method: "GET",
    });
  }

  async post(endpoint: string, options?: APIClientOptions) {
    const requestUrl = this._getRequestUrl(endpoint, options);

    return this.fetch(requestUrl, {
      ...options,
      method: "POST",
    });
  }

  async put(endpoint: string, options?: APIClientOptions) {
    const requestUrl = this._getRequestUrl(endpoint, options);

    return this.fetch(requestUrl, {
      ...options,
      method: "PUT",
    });
  }

  async delete(endpoint: string, options?: APIClientOptions) {
    const requestUrl = this._getRequestUrl(endpoint, options);

    return this.fetch(requestUrl, {
      ...options,
      method: "DELETE",
    });
  }

  async patch(endpoint: string, options?: APIClientOptions) {
    const requestUrl = this._getRequestUrl(endpoint, options);

    return this.fetch(requestUrl, {
      ...options,
      method: "PATCH",
    });
  }
}

const apiClient = new APIClient("/api");

export { apiClient };

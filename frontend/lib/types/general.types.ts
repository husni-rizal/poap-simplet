export interface ConfigInterface {
  APP_URL: string;
  API_BASE: string;
  CHAIN_ID: number;
  EMBEDDED_WALLET_CLIENT: string;
}

declare global {
  /** Response */
  type GeneralResponse<T> = {
    data: T;
    id: string;
    status: number;
  };
  type GeneralItemsResponse<T> = {
    data: {
      items: Array<T>;
      total: number;
    };
    id: string;
    status: number;
  };
  type SuccessResponse = GeneralResponse<{ success: boolean }>;
  type TokenResponse = GeneralResponse<{ token: string }>;

  interface FetchParams {
    page?: number;
    limit?: number;
    search?: string;
    orderBy?: string;
    order?: string;
    loader?: boolean;
  }

  type KeyValue = {
    key: string | number;
    value: string | number;
  };
}

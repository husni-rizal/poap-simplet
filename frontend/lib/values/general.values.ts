export const Environments = {
  dev: 'development',
  stg: 'staging',
  prod: 'production',
};

export const WebStorageKeys = {
  USER: 'apillon_poap_user',
  APP_VERSION: 'apillon_poap_version',
};

export const ON_COLUMN_CLICK_OPEN_CLASS = 'onClickOpen';
export const PAGINATION_LIMIT = 10;
export const PAGINATION_ALL_ITEMS = { page: 1, itemsPerPage: 100000 };

export enum PageSize {
  SM = 10,
  BASE = PAGINATION_LIMIT,
  LG = 50,
}

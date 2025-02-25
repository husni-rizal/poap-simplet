import { moonbaseAlpha } from 'viem/chains';
import type { ConfigInterface } from '~/lib/types/general.types';

const config: ConfigInterface = {
  APP_URL: 'https://app-stg.apillon.io',
  API_BASE: 'https://api-stg.apillon.io',
  CHAIN_ID: moonbaseAlpha.id,
  EMBEDDED_WALLET_CLIENT: '0abc5bd9-d804-4f46-89d8-b16ccbdd5300',
};

export default config;

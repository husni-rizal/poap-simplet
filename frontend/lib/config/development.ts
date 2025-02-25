import { moonbaseAlpha } from 'viem/chains';
import type { ConfigInterface } from '~/lib/types/general.types';

const config: ConfigInterface = {
  APP_URL: 'http://localhost:3000',
  API_BASE: 'http://localhost:3001',
  CHAIN_ID: moonbaseAlpha.id,
  EMBEDDED_WALLET_CLIENT: '0abc5bd9-d804-4f46-89d8-b16ccbdd5300',
};

export default config;

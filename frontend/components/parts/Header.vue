<template>
  <nav class="container py-5 flex gap-8 justify-between items-center">
    <div v-if="logoCenter" class="w-1/3"></div>
    <div class="py-2" :class="{ 'w-1/3 text-center': logoCenter }">
      <RouterLink class="inline-block" to="/">
        <Logo :width="162" :height="28" />
      </RouterLink>
    </div>
    <div v-if="!showConnect" class="w-1/3"></div>
    <div v-else class="flex gap-2" :class="{ 'w-1/3 text-right': logoCenter }">
      <Btn
        v-if="connected && (!admin || userStore.jwt)"
        size="small"
        :color="colors.blue"
        :loading="loading"
        @click="disconnectWallet()"
      >
        Disconnect
        <small v-if="walletAddress"> ({{ shortHash(walletAddress) }}) </small>
      </Btn>
      <Btn v-else-if="connected" size="small" :color="colors.blue" :loading="loading" @click="login()"> Login </Btn>
      <Btn v-else size="small" :color="colors.blue" :loading="loading" round @click="modalWalletVisible = true">
        Connect wallet
      </Btn>
    </div>
  </nav>

  <modal
    :show="modalWalletVisible"
    @close="() => (modalWalletVisible = false)"
    @update:show="modalWalletVisible = false"
  >
    <FormWallet>
      <EmbeddedWallet
        :clientId="config.public.EMBEDDED_WALLET_CLIENT"
        passkeyAuthMode="tab_form"
        :defaultNetworkId="network.id"
        :networks="[
          {
            name: network.name,
            id: network.id,
            rpcUrl: network.rpcUrls.default.http[0],
            explorerUrl: network.blockExplorers.default.url,
          },
        ]"
        @click="connectEmbeddedWallet"
      />
    </FormWallet>
  </modal>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect, useAccountEffect, type Config } from '@wagmi/vue';
import { EmbeddedWallet, useAccount as useAccountEW, useWallet } from '@apillon/wallet-vue';
import { type Events } from '@apillon/wallet-sdk';
import { signMessage } from '@wagmi/vue/actions';
import { moonbeam, moonbaseAlpha } from '@wagmi/vue/chains';
import { Environments } from '~/lib/values/general.values';
import { colors } from '~/tailwind.config';

type LoginInterface = {
  jwt: string;
};
type LoginResponse = GeneralResponse<LoginInterface>;

const props = defineProps({
  admin: { type: Boolean, default: false },
  logoCenter: { type: Boolean, default: false },
  showConnect: { type: Boolean, default: true },
});

const config = useRuntimeConfig();
const userStore = useUserStore();
const { handleError } = useErrors();

/** Apillon Embedded wallet */
const { info } = useAccountEW();
const { wallet, signMessage: signEW } = useWallet();

/** Wagmi */
const { address, isConnected } = useAccount();
const { disconnect } = useDisconnect();
const { $wagmiConfig } = useNuxtApp();

useAccountEffect({
  onConnect: () => loginDelay(),
});

const loading = ref<boolean>(false);
const modalWalletVisible = ref<boolean>(false);
const network = config.public.ENV === Environments.prod ? moonbeam : moonbaseAlpha;

const connected = computed(() => isConnected.value || !!info.activeWallet?.address);
const walletAddress = computed(() => (isConnected.value ? address.value : info.activeWallet?.address));

onMounted(async () => {
  await sleep(1000);

  if (wallet.value) {
    if (info.activeWallet?.address) {
    }
    wallet.value?.events.on('connect', () => {
      login();
    });
    wallet.value?.events.on('accountsChanged', async (accounts: Events['accountsChanged']) => {
      if (accounts.length) {
        login();
      }
    });
    wallet.value?.events.on('dataUpdated', ({ name, newValue }) => {
      // console.debug('data', name, newValue);
    });
    wallet.value?.events.on('disconnect', () => {
      // console.debug('disconnect');
    });
  }
});

function connectEmbeddedWallet() {
  modalWalletVisible.value = false;
}

async function login() {
  loading.value = true;
  try {
    if (!props.admin) {
      loading.value = false;
      return;
    }

    const timestamp = new Date().getTime();
    const message = `test\n${timestamp}`;

    const signature = isConnected.value
      ? await signMessage($wagmiConfig as Config, { message })
      : await signEW(message);

    const res = await $api.post<LoginResponse>('/login', {
      signature,
      timestamp,
      address: walletAddress.value,
    });
    if (res.data.jwt) {
      userStore.jwt = res.data.jwt;
      $api.setToken(res.data.jwt);
    }
    modalWalletVisible.value = false;
  } catch (e) {
    handleError(e);
  }
  loading.value = false;
}

function loginDelay() {
  setTimeout(() => login(), 100);
}

function disconnectWallet() {
  userStore.jwt = '';
  disconnect();
}
</script>

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
        v-if="isConnected && (!admin || userStore.jwt)"
        size="small"
        :color="colors.blue"
        :loading="loading"
        @click="disconnectWallet()"
      >
        Disconnect
        <small v-if="address"> ({{ shortHash(address) }}) </small>
      </Btn>
      <Btn v-else-if="isConnected" size="small" :color="colors.blue" :loading="loading" @click="login()"> Login </Btn>
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
import { useAccount, useConnect, useDisconnect, useConnectorClient, useAccountEffect, type Config } from '@wagmi/vue';
import { EmbeddedWallet } from '@apillon/wallet-vue';
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
const { error } = useMessage();
const userStore = useUserStore();
const { handleError } = useErrors();

const { connect, connectors } = useConnect();
const { data: walletClient, refetch } = useConnectorClient();
const { address, isConnected } = useAccount();
const { disconnect } = useDisconnect();
const { $wagmiConfig } = useNuxtApp();

useAccountEffect({
  onConnect: () => loginDelay(),
});

const loading = ref<boolean>(false);
const modalWalletVisible = ref<boolean>(false);
const network = config.public.ENV === Environments.prod ? moonbeam : moonbaseAlpha;

function connectEmbeddedWallet() {
  modalWalletVisible.value = false;
}

async function login() {
  loading.value = true;
  try {
    if (!isConnected.value) {
      await connect({ connector: connectors.value[0] });
    } else {
      await refetch();

      if (!walletClient.value) {
        await connect({ connector: connectors.value[0] });

        if (!walletClient.value) {
          error('Could not connect with wallet');
          loading.value = false;
          return;
        }
      }

      if (!props.admin) {
        loading.value = false;
        return;
      }

      const timestamp = new Date().getTime();
      const message = 'test';

      const signature = await signMessage($wagmiConfig as Config, { message: `${message}\n${timestamp}` });

      const res = await $api.post<LoginResponse>('/login', {
        signature,
        timestamp,
        address: walletClient.value.account.address,
      });
      if (res.data.jwt) {
        userStore.jwt = res.data.jwt;
        $api.setToken(res.data.jwt);
      }
      modalWalletVisible.value = false;
    }
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

import { http, createConfig, WagmiPlugin, createStorage } from '@wagmi/vue';
import { moonbeam, moonbaseAlpha } from '@wagmi/vue/chains';
import { type Chain } from '@wagmi/vue/chains';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { metaMask, coinbaseWallet, walletConnect } from '@wagmi/vue/connectors';

export default defineNuxtPlugin(nuxtApp => {
  const chains: readonly [Chain, ...Chain[]] = [moonbeam, moonbaseAlpha];

  const transports = chains.reduce((acc, chain) => {
    acc[chain.id] = http();
    return acc;
  }, {});

  const wagmiConfig = createConfig({
    chains,
    connectors: [
      metaMask({
        dappMetadata: {
          name: 'LendeeFi Metamask wallet',
        },
      }),
      coinbaseWallet({
        appName: 'Apillon Prebuild solution',
      }),
      walletConnect({
        projectId: 'fefd3005e5f3b8fd2e73de5333eeccf9',
      }),
    ],
    multiInjectedProviderDiscovery: false,
    storage: createStorage({ storage: window.sessionStorage }),
    transports,
  });
  nuxtApp.provide('wagmiConfig', wagmiConfig);
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig });
  nuxtApp.vueApp.use(VueQueryPlugin);
});

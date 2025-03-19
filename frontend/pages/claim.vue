<script lang="ts" setup>
import SuccessSVG from '~/assets/images/success.svg';

definePageMeta({
  layout: 'claim',
});
useHead({
  title: 'Apillon POAP prebuilt solution',
});

const { query } = useRoute();
const router = useRouter();
const { success } = useMessage();
const { handleError } = useErrors();
const { connected, walletAddress, sign } = useWalletConnect();

const loading = ref<boolean>(false);
const claimed = ref<boolean>(false);

onBeforeMount(() => {
  if (!query.token) {
    router.push('/');
  }
});

async function claimAirdrop() {
  loading.value = true;
  try {
    const timestamp = new Date().getTime();
    const message = `test\n${timestamp}`;

    const signature = await sign(message);

    const res = await $api.post<SuccessResponse>('/claim', {
      jwt: query.token,
      signature,
      address: walletAddress.value,
      timestamp,
    });
    if (res.data && res.data.success) {
      success('You successfully claimed NFT');
      claimed.value = true;
    }
  } catch (e) {
    handleError(e);
  }
  loading.value = false;
}
</script>

<template>
  <!--<FormShare v-if="claimed" />-->
  <div v-if="claimed" class="max-w-md w-full md:px-6 my-12 mx-auto">
    <img :src="SuccessSVG" class="mx-auto" width="165" height="169" alt="airdrop" />

    <div class="my-8 text-center">
      <h3 class="mb-6">Great Success!</h3>
      <p>You have successfully received POAP NFT, which you can use to proove that you were part of the event.</p>
    </div>
  </div>
  <div v-else class="max-w-md w-full md:px-6 my-12 mx-auto">
    <img :src="SuccessSVG" class="mx-auto" width="165" height="169" alt="airdrop" />

    <div class="my-8 text-center">
      <h3 class="mb-6">Great Success!</h3>
      <p>
        To claim your POAP (NFT airdrop), you need to connect your EVM compatible wallet. This step is crucial for
        securely receiving and managing the airdropped NFTs.
      </p>
    </div>

    <WalletConnect v-if="!connected" size="large" />
    <Btn v-else size="large" :loading="loading" @click="claimAirdrop()">Claim airdrop</Btn>
  </div>
</template>

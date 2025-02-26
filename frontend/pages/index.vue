<template>
  <div class="container">
    <div v-if="isLoggedIn" class="max-w-5xl mx-auto justify-items-center">
      <h1>Your PoAP drops</h1>
      <div v-if="poapStore.poapDrops" class="w-full mt-8">
        <TablePoapDrops class="card" />
        <div class="text-center mt-8">
          <Btn type="primary" @click="modalPoapVisible = true">Create new PoAP</Btn>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="max-w-2xl mx-auto mb-10 text-center">
        <h1>POAP drops</h1>
        <p>
          You can use this page to create digital keepsakes to commemorate special events and distribute them to your
          audience for their attendance.
        </p>
      </div>
      <div class="grid lg:grid-cols-3 gap-x-12 gap-y-6 text-center mb-12">
        <div v-for="(content, key) in poapDrops" class="card-dark flex flex-col gap-12 items-center">
          <NuxtIcon :name="`poap-drops-${key + 1}`" class="icon-auto" filled />
          <p>{{ content }}</p>
        </div>
      </div>
    </div>
    <ModalPoap
      :show="modalPoapVisible"
      @close="() => (modalPoapVisible = false)"
      @update:show="modalPoapVisible = false"
    ></ModalPoap>
  </div>
</template>

<script lang="ts" setup>
import { useAccount } from '@wagmi/vue';
import { useAccount as useAccountEW } from '@apillon/wallet-vue';

const userStore = useUserStore();
const poapStore = usePoapDropStore();

const { info } = useAccountEW();
const { isConnected } = useAccount();

const modalPoapVisible = ref(false);
const isLoggedIn = computed(() => (isConnected.value || !!info.activeWallet?.address) && userStore.jwt);

const poapDrops = [
  'Create digital keepsakes to commemorate special events',
  'Display QR code somewhere on your event grounds. ',
  'Visitors scan randomly generated time-dependent QR codes  and reserve the NFTs.',
];

useHead({
  title: 'Apillon Proof of attendance prebuilt solution',
  titleTemplate: '',
});

onMounted(async () => {
  if (isLoggedIn.value) {
    await poapStore.getPoapDrops();
  }
});

watch(
  () => isLoggedIn.value,
  async _ => {
    if (isLoggedIn.value) {
      await poapStore.getPoapDrops();
    }
  }
);
</script>

<template>
  <div v-if="loading">
    <Spinner :size="64" />
  </div>
  <div v-else-if="poapStore.poapDrop" class="frame max-w-xl mx-auto h-[80vh] max-h-[calc(100vh-190px)]">
    <div class="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-full lg:mb-2">
      <div class="max-w-xl flex justify-between items-center gap-4 text-white text-sm font-bold">
        <NuxtLink :to="`/poaps/${poapId}`">
          <NuxtIcon name="back" class="text-2xl" />
        </NuxtLink>
        <n-ellipsis class="align-bottom leading-normal" :line-clamp="1">{{ poapStore.poapDrop.website }}</n-ellipsis>
        <button class="ml-2 -mt-1 -mb-3" @click="copyToClipboard(poapStore.poapDrop.website)">
          <span class="icon-copy text-lg"></span>
        </button>
      </div>
    </div>
    <div class="frame-border h-full flex flex-col justify-evenly items-center gap-8 p-8 lg:pb-16 text-center">
      <template v-if="poapStatus === PoapStatus.WAITING">
        <span>Time to event</span>
        <Timer :date-time-to="poapStore.poapDrop.startTime"></Timer>
      </template>
      <template v-if="poapStatus === PoapStatus.IN_PROGRESS || immediatelyShowQr == true">
        <NuxtIcon name="cube" class="icon-auto" filled />
        <h2 class="max-w-xs mx-auto">Scan the code and receive NFT</h2>
        <n-qr-code v-if="qrCodeText" :value="qrCodeText" class="box-content" :size="200" />
        <div class="">
          <span class="text-sm">Next generated QR code in</span>
          <h4 class="text-yellow text-2xl">{{ timer }}s</h4>
        </div>
      </template>
      <span v-else-if="poapStatus === PoapStatus.FINISHED">Event concluded</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PoapStatus } from '~/lib/types/poap';

const config = getConfig();
const { params, query } = useRoute();
const poapStore = usePoapDropStore();

let qrCodeInterval: any = null as any;
let timerInterval: any = null as any;
const loading = ref(true);
const poapStatus = ref();
const token = ref('');
const timer = ref(5);
const qrCodeText = computed<string>(() => `${config.APP_URL}/poaps/${poapId.value}/reserve-mint?token=${token.value}`);

/** Website ID from route */
const poapId = ref<string>(`${params?.slug}`);
const immediatelyShowQr = ref(query.immediatelyShowQr === 'true');

onMounted(async () => {
  loading.value = true;
  await poapStore.getPoapDrop(poapId.value);
  await setQrCodeValue();
  loading.value = false;

  qrCodeInterval = setInterval(async () => {
    await setQrCodeValue();
  }, 5000);
});

onBeforeUnmount(() => {
  clearInterval(qrCodeInterval);
  clearInterval(timerInterval);
});

async function setQrCodeValue() {
  if (poapStore.poapDrop?.startTime && poapStore.poapDrop?.endTime) {
    poapStatus.value = getPoapStatus(poapStore.poapDrop.startTime, poapStore.poapDrop.endTime);

    if (poapStatus.value === PoapStatus.FINISHED && immediatelyShowQr.value !== true) {
      clearInterval(qrCodeInterval);
    }
    if (poapStatus.value === PoapStatus.IN_PROGRESS || immediatelyShowQr.value === true) {
      await getReservationToken();

      clearInterval(timerInterval);
      timer.value = 5;
      timerInterval = setInterval(async () => {
        timer.value -= 1;
      }, 1000);
    }
  }
}

async function getReservationToken() {
  try {
    const { data } = await $api.get<TokenResponse>(`/poap-drops/${poapId.value}/drop-reservation-token`);
    token.value = data.token;
  } catch (error) {
    token.value = '';
  }
}
</script>

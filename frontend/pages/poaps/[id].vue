<template>
  <div v-if="loading">
    <Spinner :size="64" />
  </div>
  <div v-else-if="poapStore.poapDrop" class="max-w-5xl mx-auto">
    <div class="card relative text-center">
      <div class="absolute top-4 left-4">
        <Btn type="default" inner-class="flex gap-2 items-center" :to="'/'">
          <NuxtIcon name="back" class="text-2xl" />
          <strong> All drops </strong>
        </Btn>
      </div>
      <div v-if="userStore.jwt" class="absolute top-4 right-4">
        <Btn type="default" @click="modalEditPoapVisible = true">
          <NuxtIcon name="edit" class="text-2xl" />
        </Btn>
      </div>

      <Tag :status="poapStatus" class="mb-4">
        <span v-if="poapStatus === PoapStatus.WAITING">Waiting</span>
        <span v-else-if="poapStatus === PoapStatus.IN_PROGRESS">Event running</span>
        <span v-else>Concluded</span>
      </Tag>
      <h2 class="mb-4">
        {{ poapStore.poapDrop.title }}
      </h2>
      <div v-if="poapStatus === PoapStatus.WAITING" class="flex flex-col items-center">
        <strong>Event starts in</strong>
        <Timer :date-time-to="poapStore.poapDrop.startTime" />
      </div>
      <div v-else-if="poapStatus === PoapStatus.IN_PROGRESS" class="flex flex-col items-center">
        <strong>Event ends in</strong>
        <Timer :date-time-to="poapStore.poapDrop.endTime" />
      </div>
      <div v-else-if="poapStatus === PoapStatus.FINISHED" class="w-full mt-6">
        <strong class="inline-block mb-6 text-sm">Event statistics</strong>
        <div class="flex justify-center gap-6">
          <div class="flex flex-col items-center p-3 rounded-md bg-bg-light w-40">
            <span class="font-bold" style="font-size: xx-large">{{ poapStore.dropReservations.total }}</span>
            <p class="text-xs">Total participants</p>
          </div>
          <div class="flex flex-col items-center p-3 rounded-md bg-bg-light w-40">
            <span class="font-bold" style="font-size: xx-large">
              {{ poapStore.dropReservations.items.filter(x => x.airdropStatus == 6).length }} /
              {{ poapStore.dropReservations.total }}
            </span>
            <p class="text-xs">Minted NFTs</p>
          </div>
        </div>
      </div>

      <div v-if="poapStatus === PoapStatus.WAITING" class="p-6 mt-8 border border-yellow rounded-2xl text-left">
        <div class="flex gap-4">
          <NuxtIcon name="info" class="text-2xl" />
          <h5>Next step is to personalize POAP drop</h5>
        </div>
        <p class="my-3 text-white">
          Configure the domain and your own SMTP server in order to personalize the POAP drop. Hosting the POAP drop
          from your custom domain and sending emails to your clients via your domain brings trust from the users and
          increases the minting conversion rates.
        </p>
        <button class="text-yellow font-bold hover:underline">Configure domain and E-mail SMTP</button>
      </div>
      <template v-else-if="poapStatus === PoapStatus.IN_PROGRESS">
        <div class="h-8"></div>
        <div class="relative"></div>
      </template>
    </div>
    <n-tabs v-if="poapStatus === PoapStatus.IN_PROGRESS" class="-mt-9" :gap="32" justify-content="center" animated>
      <n-tab-pane name="client" tab="Client side">
        <PoapInfo :poap-id="Number(poapId)" />
      </n-tab-pane>
      <n-tab-pane name="activity" tab="Recent activity">
        <template #tab>
          Recent activity
          <span
            class="inline-flex justify-center items-center w-6 h-6 ml-2 rounded-full bg-pink font-bold text-bg-dark text-[10px]"
          >
            {{ poapStore.dropReservations.items.length }}
          </span>
        </template>
        <div class="p-8">
          <h4 class="mt-8 mb-4 text-center text-2xl">Recent activity</h4>
          <TablePoapReservation :poap-id="poapId" />
        </div>
      </n-tab-pane>
    </n-tabs>
    <TablePoapReservation v-else-if="poapStatus === PoapStatus.FINISHED" class="mt-8" :poap-id="poapId" />

    <modal
      :show="modalEditPoapVisible"
      title="Update PoAP drop"
      @close="() => (modalEditPoapVisible = false)"
      @update:show="modalEditPoapVisible = false"
    >
      <FormPoapEdit class="mt-4" :poap="poapStore.poapDrop" @submit-success="modalEditPoapVisible = false" />
    </modal>
  </div>
</template>

<script lang="ts" setup>
import { PoapStatus } from '~/lib/types/poap';

const { params } = useRoute();
const userStore = useUserStore();
const poapStore = usePoapDropStore();

const poapId = ref<string>(`${params?.id}`);
const poapStatus = ref(PoapStatus.WAITING);
const modalEditPoapVisible = ref(false);
const loading = ref(true);

let refreshEventTimeInterval: any = null as any;

onMounted(async () => {
  loading.value = true;
  await poapStore.getPoapDrop(poapId.value);
  calculatePoapStatus();
  loading.value = false;

  if (poapStore.poapDrop) {
    refreshEventTimeInterval = setInterval(() => {
      calculatePoapStatus();
    }, 1000);
  }
});

onBeforeUnmount(() => {
  clearInterval(refreshEventTimeInterval);
});

function calculatePoapStatus() {
  if (poapStore.poapDrop?.startTime && poapStore.poapDrop?.endTime) {
    poapStatus.value = getPoapStatus(poapStore.poapDrop.startTime, poapStore.poapDrop.endTime);
    if (poapStatus.value === PoapStatus.FINISHED) {
      clearInterval(refreshEventTimeInterval);
    }
  }
}
</script>

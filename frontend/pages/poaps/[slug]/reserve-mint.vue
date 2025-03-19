<template>
  <div v-if="loading">
    <Spinner :size="64" />
  </div>
  <div v-else-if="poapStore.poapDrop" class="frame max-w-sm mx-auto min-h-[calc(100vh-190px)]">
    <div class="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-full lg:mb-2">
      <div class="max-w-sm flex justify-between items-center gap-4 text-white text-sm font-bold">
        <NuxtLink :to="`/poaps/${poapId}`">
          <NuxtIcon name="back" class="text-2xl" />
        </NuxtLink>
        <n-ellipsis class="align-bottom leading-normal" :line-clamp="1">{{ poapStore.poapDrop.website }}</n-ellipsis>
        <button class="ml-2 -mt-1 -mb-3" @click="copyToClipboard(poapStore.poapDrop.website)">
          <span class="icon-copy text-lg"></span>
        </button>
      </div>
    </div>
    <div class="frame-border h-full min-h-60 flex flex-col justify-evenly gap-5 p-6 text-center">
      <div v-if="!isTokenValid">
        <p>Token is invalid or has expired...</p>
      </div>
      <div v-else-if="dropReserved">
        <p>You have successfully reserved NFT. Check your mail for instructions on how to mint.</p>
      </div>
      <template v-else>
        <h2 class="text-3xl mt-2">Enter your email to reserve NFT</h2>
        <p>Once you have entered your e-mail address, you will receive instructions on how to claim NFT.</p>
        <n-form ref="formRef" :model="formData" class="text-left mt-2" :rules="rules" @submit.prevent="handleSubmit">
          <!--  Project Quota value -->
          <n-form-item path="email" :show-label="false">
            <n-input v-model:value="formData.email" placeholder="Enter your email" clearable />
          </n-form-item>

          <!--  Form submit -->
          <n-form-item :show-label="false" :show-feedback="false">
            <input type="submit" class="hidden" />
            <Btn size="large" type="primary" :loading="loading" @click="handleSubmit"> Proceed </Btn>
          </n-form-item>
        </n-form>

        <div class="flex flex-col items-center mb-8">
          <p>{{ timer }} min left</p>
          <n-progress
            class="mt-1"
            type="line"
            :percentage="tokenValidityInPercent"
            :height="6"
            :border-radius="4"
            :fill-border-radius="0"
            :show-indicator="false"
          />
        </div>
        <h4>{{ poapStore.poapDrop.title }}</h4>
        <HorizontalSlider class="flex gap-2">
          <img v-for="i in 5" :key="i" :src="`/images/nfts/${i}.png`" class="h-32 rounded-lg pointer-events-none" />
        </HorizontalSlider>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import type { FormInst, FormRules, FormValidationError } from 'naive-ui/es/form';
import type { PoapReservationResponse } from '~/lib/types/poap';

useHead({
  title: 'Apillon POAP prebuilt solution',
});
const { handleError } = useErrors();
const message = useMessage();
const { params, query } = useRoute();
const poapStore = usePoapDropStore();

const loading = ref(false);
const isTokenValid = ref(true);
const tokenValidityInPercent = ref(100);
const dropReserved = ref(false);
let calcRemainingTimeInterval: any = null as any;

const poapId = ref<string>(`${params?.slug}`);
const token = query.token?.toString();

const timer = computed(() => Math.ceil(tokenValidityInPercent.value / 20));

const formRef = ref<FormInst | null>(null);
const formData = reactive<any>({
  email: null,
  token,
});
const rules: FormRules = {
  email: [
    {
      required: true,
      type: 'string',
      trigger: 'input',
    },
  ],
};

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      reserveMint();
    }
  });
}

onMounted(() => {
  if (token) {
    const decoded = jwtDecode(token);

    const tokenIssueDate = Number(dayjs(decoded.iat * 1000));

    isTokenValid.value = Number(dayjs()) - tokenIssueDate < 7000;

    if (!poapStore.poapDrop) poapStore.getPoapDrop(poapId.value);

    calcRemainingTimeInterval = setInterval(() => {
      const currDate = dayjs();
      const tokenAgeInMs = Number(currDate) - tokenIssueDate;

      tokenValidityInPercent.value = 100 - (tokenAgeInMs * 100) / 300000;

      if (tokenValidityInPercent.value <= 0) {
        tokenValidityInPercent.value = 0;
        isTokenValid.value = false;
        clearInterval(calcRemainingTimeInterval);
      }
    }, 1000);
  } else {
    isTokenValid.value = false;
  }
});

onBeforeUnmount(() => {
  clearInterval(calcRemainingTimeInterval);
});

async function reserveMint() {
  loading.value = true;
  try {
    const { data } = await $api.post<PoapReservationResponse>(`/poap-drops/${params.slug}/reserve-drop`, formData);
    if (data.id) {
      dropReserved.value = true;
      clearInterval(calcRemainingTimeInterval);
    }
  } catch (err: any) {
    handleError(err);
    // message.error(`Error reserving mint. ${apiErrorToMsg(err.data)}`);
  }

  loading.value = false;
}
</script>

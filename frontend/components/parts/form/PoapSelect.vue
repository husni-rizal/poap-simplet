<script lang="ts" setup>
const emit = defineEmits(['proceed', 'close']);
const { collections, formData, loading, getCollections } = usePoapDrop();
const message = useMessage();

onMounted(() => {
  if (!collections.value?.length) {
    getCollections();
  }
});

function validateFormAndProceed(e: Event | MouseEvent) {
  e.preventDefault();
  if (formData.collectionUuid) {
    emit('proceed');
  } else {
    message.warning('Please select NFT collection, that will be used for drop');
  }
}
</script>

<template>
  <div class="flex flex-col max-w-xl mx-auto">
    <h1 class="mb-8">New PoAP drop</h1>

    <div v-if="collections && collections.length === 0 && !loading" class="flex gap-4 p-4 my-8 border border-yellow">
      <NuxtIcon name="info" class="text-2xl" />
      <p>
        You dont have any NFT collections deployed via Apillon. Create a NFT collection first and return back to POAP
        drop deployment.
      </p>
    </div>
    <div v-else>
      <p class="mb-2">Select existing NFT collection on Apillon</p>
      <n-select
        v-model:value="formData.collectionUuid"
        :options="collections"
        :loading="loading"
        label-field="name"
        value-field="uuid"
      />
    </div>

    <a
      v-if="collections && collections.length === 0 && !loading"
      href="https://app.apillon.io/dashboard/service/nft"
      target="_blank"
    >
      <Btn size="large" type="primary" @click="emit('close')">Go back to Apillon and create NFT collection</Btn>
    </a>
    <Btn v-else type="primary" class="mt-10" @click="validateFormAndProceed">Proceed</Btn>
  </div>
</template>

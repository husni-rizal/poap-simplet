<script lang="ts" setup>
const emit = defineEmits(['close']);
</script>

<template>
  <div class="flex flex-col pt-8 max-w-md md:px-6 mx-auto text-center">
    <NuxtIcon name="success" class="icon-auto inline-flex justify-center" filled />
    <h3 class="mt-8 mb-6">Great Success!</h3>
    <p>POAP event was successfully deployed. Now you can manage and personalize your drop.</p>

    <div class="mt-12">
      <Btn size="large" type="primary" @click="emit('close')">Manage POAP drop</Btn>
    </div>
  </div>
</template>

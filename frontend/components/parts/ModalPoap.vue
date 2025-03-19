<template>
  <modal v-bind="$attrs" class="hide-header" :title="title">
    <FormPoapSelect
      v-if="currStep === PoapDropStep.COLLECTION"
      @proceed="currStep = PoapDropStep.FORM"
      @close="$emit('close')"
    />
    <FormPoap v-else-if="currStep == PoapDropStep.FORM" @proceed="currStep = PoapDropStep.PREVIEW" />
    <div v-else-if="currStep == PoapDropStep.DEPLOYING" class="text-center">
      <Loader />
      <h3>Deploying POAP drop</h3>
    </div>
    <FormPoapPreview v-else-if="currStep == PoapDropStep.PREVIEW" @back="currStep = PoapDropStep.FORM" />
    <FormPoapSuccess v-else-if="currStep == PoapDropStep.SUCCESS" @close="$emit('close')" />
  </modal>
</template>

<script lang="ts" setup>
defineProps({
  fullscreen: { type: Boolean, default: false },
  title: { type: String, default: null },
});
defineEmits(['close']);

const { currStep, resetState } = usePoapDrop();

onMounted(() => {
  resetState();
});
</script>

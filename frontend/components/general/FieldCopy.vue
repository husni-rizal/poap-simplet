<template>
  <div class="flex justify-between items-center card-border rounded-lg bg-white text-bg text-sm pl-5 p-3">
    <n-ellipsis class="align-bottom leading-normal" :line-clamp="1">
      {{ text }}
    </n-ellipsis>
    <button v-if="copy" class="ml-2 -mt-1 -mb-3" @click="copyToClipboard(text)">
      <span class="icon-copy text-lg"></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  text: { type: String, default: '' },
  copy: { type: Boolean, default: true },
});
</script>

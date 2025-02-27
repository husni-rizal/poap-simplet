<template>
  <nav class="container py-5 flex gap-8 justify-between items-center">
    <div v-if="logoCenter" class="w-1/3"></div>
    <div class="py-2" :class="{ 'w-1/3 text-center': logoCenter }">
      <RouterLink class="inline-block" to="/">
        <Logo :width="162" :height="28" />
      </RouterLink>
    </div>
    <div v-if="!showConnect" class="w-1/3"></div>
    <div v-else class="flex gap-2" :class="{ 'w-1/3 text-right': logoCenter }">
      <WalletConnect :admin="admin" />
    </div>
  </nav>
</template>

<script lang="ts" setup>
defineProps({
  admin: { type: Boolean, default: false },
  logoCenter: { type: Boolean, default: false },
  showConnect: { type: Boolean, default: true },
});
</script>

<template>
  <n-layout class="relative h-screen" :native-scrollbar="false">
    <Header :admin="true" />
    <div class="container flex-grow pb-8 md:pb-16 pt-4 md:pt-8">
      <slot />
    </div>
  </n-layout>
</template>

<script lang="ts" setup></script>

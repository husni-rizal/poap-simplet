<script lang="ts" setup>
const emit = defineEmits(['back']);
const { collections, formData, createPoapDrop } = usePoapDrop();

const collectionName = computed(() => (collections.value.find(c => c.uuid === formData.collectionUuid) || {}).name);
</script>

<template>
  <div class="flex flex-col max-w-xl mx-auto">
    <h1 class="mb-8">Preview PoAP drop</h1>
    <table class="">
      <tbody>
        <tr>
          <td>Target NFT collection</td>
          <td>{{ collectionName }}</td>
        </tr>
        <tr>
          <td>Title</td>
          <td>{{ formData.title }}</td>
        </tr>
        <tr>
          <td>Description</td>
          <td>{{ formData.description }}</td>
        </tr>
        <tr>
          <td>Website</td>
          <td>{{ formData.website }}</td>
        </tr>
        <tr>
          <td>Event start date</td>
          <td>{{ dateToDateTime(new Date(formData.startTime)) }}</td>
        </tr>
        <tr>
          <td>Event end date</td>
          <td>{{ dateToDateTime(new Date(formData.endTime)) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="mt-12 flex gap-4 max-w-xl relative pr-4">
      <Btn class="w-1/2" type="secondary" @click="emit('back')">Edit</Btn>
      <Btn class="w-1/2" type="primary" @click="createPoapDrop()">Create</Btn>
    </div>
  </div>
</template>

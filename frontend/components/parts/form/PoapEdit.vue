<script lang="ts" setup>
import type { FormValidationError } from 'naive-ui/es/form';
import type { PoapInterface, PoapResponse } from '~/lib/types/poap';

const emit = defineEmits(['submitSuccess']);
const props = defineProps({
  poap: { type: Object as PropType<PoapInterface>, required: true },
});
const message = useMessage();
const poapStore = usePoapDropStore();
const { handleError } = useErrors();
const { formData, loading, rules, formRef } = usePoapDrop();

onMounted(() => {
  formData.collectionUuid = props.poap.collectionUuid;
  formData.title = props.poap.title;
  formData.description = props.poap.description;
  formData.startTime = props.poap.startTime;
  formData.endTime = props.poap.endTime;
  formData.website = props.poap.website;
});

function validateFormAndProceed(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      editPoapDrop();
    }
  });
}
async function editPoapDrop() {
  loading.value = true;
  try {
    const { data } = await $api.put<PoapResponse>(`/poap-drops`, {
      id: props.poap.id,
      ...formData,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
    });
    updatePoapInStore(data);
    emit('submitSuccess');
  } catch (error) {
    handleError(error, 'Error updating POAP');
  }
  loading.value = false;
}

function updatePoapInStore(poap: PoapInterface) {
  poapStore.poapDrop = poap;
  poapStore.poapDrops.items.forEach(item => {
    if (item.id === poap.id) {
      Object.assign(item, poap);
    }
  });
}
</script>

<template>
  <div class="max-w-xl mx-auto">
    <n-form ref="formRef" :model="formData" :rules="rules" @submit.prevent="validateFormAndProceed">
      <!--  Project Quota value -->
      <n-form-item path="title" label="Title" :label-props="{ for: 'title' }">
        <n-input v-model:value="formData.title" clearable />
      </n-form-item>
      <n-form-item path="description" label="Description" :label-props="{ for: 'description' }">
        <n-input v-model:value="formData.description" clearable />
      </n-form-item>

      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" path="startTime" label="Start time" :label-props="{ for: 'startTime' }">
          <n-date-picker v-model:value="formData.startTime" class="w-full" type="datetime" clearable />
        </n-form-item-gi>
        <n-form-item-gi :span="12" path="endTime" label="End time" :label-props="{ for: 'endTime' }">
          <n-date-picker v-model:value="formData.endTime" class="w-full" type="datetime" clearable />
        </n-form-item-gi>
      </n-grid>

      <n-form-item path="website" label="Website" :label-props="{ for: 'website' }">
        <n-input v-model:value="formData.website" clearable />
      </n-form-item>
      <n-form-item :show-label="false" :showFeedback="false">
        <Btn size="large" type="primary" :loading="loading" @click="validateFormAndProceed">Update</Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

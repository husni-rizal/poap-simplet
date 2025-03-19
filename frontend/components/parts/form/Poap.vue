<script lang="ts" setup>
import type { FormValidationError } from 'naive-ui/es/form';

const emit = defineEmits(['proceed']);
const { formData, rules, formRef } = usePoapDrop();
const message = useMessage();

function validateFormAndProceed(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      emit('proceed');
    }
  });
}
</script>

<template>
  <div class="max-w-xl mx-auto">
    <h1 class="mb-8">New PoAP drop</h1>
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
        <Btn size="large" type="primary" @click="validateFormAndProceed">Continue</Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

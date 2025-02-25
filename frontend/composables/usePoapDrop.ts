import type { FormInst, FormRules } from 'naive-ui';
import type { PoapResponse } from '~/lib/types/poap';

export enum PoapDropStep {
  COLLECTION = 1,
  FORM = 2,
  PREVIEW = 3,
  DEPLOYING = 4,
  SUCCESS = 5,
}

const currStep = ref(PoapDropStep.COLLECTION);
const collections = ref<any[]>([]);

const formData = reactive<any>({
  title: null,
  description: null,
  collectionUuid: null,
  startTime: null,
  endTime: null,
  website: null,
});

export default function usePoapDrop() {
  const { handleError } = useErrors();
  const poapStore = usePoapDropStore();

  const loading = ref(false);
  const formRef = ref<FormInst | null>(null);

  const rules: FormRules = {
    title: [
      {
        required: true,
        type: 'string',
        trigger: 'input',
      },
    ],
    startTime: [
      {
        required: true,
        type: 'date',
        trigger: 'input',
      },
    ],
    endTime: [
      {
        required: true,
        type: 'date',
        trigger: 'input',
      },
    ],
  };

  async function getCollections() {
    loading.value = true;
    try {
      const res = await $api.get('/nft-collections');
      collections.value = (res as any).data.items;
    } catch (error) {}
    loading.value = false;
  }

  async function createPoapDrop() {
    loading.value = true;
    currStep.value = PoapDropStep.DEPLOYING;
    try {
      const res = await $api.put<PoapResponse>(`/poap-drops`, {
        ...formData,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
      });
      poapStore.getPoapDrops();
      setTimeout(() => (currStep.value = PoapDropStep.SUCCESS), 1000);
    } catch (error) {
      handleError(error, 'Error creating new POAP');
      currStep.value = PoapDropStep.PREVIEW;
    }
    loading.value = false;
  }

  function resetState() {
    currStep.value = PoapDropStep.COLLECTION;
    formData.title = null;
    formData.description = null;
    formData.collectionUuid = null;
    formData.startTime = null;
    formData.endTime = null;
    formData.website = null;
  }

  return {
    collections,
    currStep,
    formData,
    formRef,
    loading,
    rules,
    createPoapDrop,
    getCollections,
    resetState,
  };
}

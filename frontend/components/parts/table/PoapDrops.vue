<template>
  <n-data-table
    v-bind="$attrs"
    :columns="columns"
    :data="poapStore.poapDrops.items"
    :loading="poapStore.poapDrops.loading"
    :pagination="createPagination(false)"
    :bordered="false"
    :row-props="rowProps"
    @update:page="handlePageChange"
  >
    <template #empty>You dont have any POAP drops yet.</template>
  </n-data-table>
  <modal
    :show="modalEditPoapVisible"
    title="Update PoAP drop"
    @close="() => (modalEditPoapVisible = false)"
    @update:show="modalEditPoapVisible = false"
  >
    <FormPoapEdit v-if="currentRow" class="mt-4" :poap="currentRow" @submit-success="modalEditPoapVisible = false" />
  </modal>
</template>

<script lang="ts" setup>
import { type DataTableColumns, NButton, NDropdown } from 'naive-ui';
import type { PoapInterface } from '~/lib/types/poap';
import { ON_COLUMN_CLICK_OPEN_CLASS } from '~/lib/values/general.values';

const router = useRouter();
const poapStore = usePoapDropStore();

const currentRow = ref<PoapInterface | undefined>();
const modalEditPoapVisible = ref(false);

const columns: DataTableColumns<PoapInterface> = [
  {
    title: 'Title',
    key: 'title',
    minWidth: 150,
    className: ON_COLUMN_CLICK_OPEN_CLASS,
  },
  {
    title: 'Description',
    key: 'description',
    minWidth: 110,
  },
  {
    key: 'startTime',
    title: 'Start date',
    minWidth: 200,
    render(row: PoapInterface) {
      return h('span', {}, { default: () => datetimeToDateAndTime(row.startTime.toString()) });
    },
  },
  {
    key: 'endTime',
    title: 'End date',
    minWidth: 200,
    render(row: PoapInterface) {
      return h('span', {}, { default: () => datetimeToDateAndTime(row.endTime.toString()) });
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'right',
    className: '!py-0',
    minWidth: 80,
    render(row: PoapInterface) {
      return h(
        NDropdown,
        {
          options: dropdownOptions(row),
          trigger: 'click',
        },
        {
          default: () =>
            h(
              NButton,
              { type: 'tertiary', size: 'small', quaternary: true, round: true },
              {
                default: () => h(resolveComponent('i'), { class: 'icon-more text-xl' }, ''),
              }
            ),
        }
      );
    },
  },
];

function rowProps(row: PoapInterface) {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        navigateToPoapDrop(row);
      }
    },
  };
}

async function handlePageChange(currentPage: number) {
  await poapStore.getPoapDrops({ page: currentPage });
}

const dropdownOptions = (poapDrop: any) => {
  return [
    {
      label: 'Edit',
      key: 'edit',
      props: {
        onClick: () => {
          modalEditPoapVisible.value = true;
        },
      },
    },
    {
      label: 'View',
      key: 'view',
      props: {
        onClick: () => {
          navigateToPoapDrop(poapDrop);
        },
      },
    },
  ];
};

function navigateToPoapDrop(poapDrop: any) {
  router.push(`/poaps/${poapDrop.id}`);
}
</script>

<template>
  <n-data-table
    :columns="columns"
    :data="poapStore.dropReservations.items"
    :loading="poapStore.dropReservations.loading"
    :pagination="createPagination(false)"
    :bordered="false"
  >
    <template #empty>You dont have any reservation yet.</template>
  </n-data-table>
</template>

<script lang="ts" setup>
import { type DataTableColumns } from 'naive-ui';
import { AirdropStatus } from '~/lib/types/poap';

const props = defineProps({
  poapId: { type: [Number, String], required: true },
});

const poapStore = usePoapDropStore();

onMounted(() => {
  poapStore.getPoapDropReservations(props.poapId);
});

const columns: DataTableColumns<any> = [
  {
    title: 'Email',
    key: 'email',
    minWidth: 150,
  },
  {
    title: 'Airdrop status',
    key: 'airdropStatus',
    minWidth: 100,
    render(row: any) {
      return h('span', {}, { default: () => AirdropStatus[row.airdropStatus] });
    },
  },
  {
    title: 'Wallet',
    key: 'wallet',
    minWidth: 100,
  },
  {
    title: 'Tx hash',
    key: 'txHash',
    minWidth: 100,
  },
];
</script>

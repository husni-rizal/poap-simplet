import { defineStore } from 'pinia';
import type {
  PoapInterface,
  PoapReservationInterface,
  PoapReservationsResponse,
  PoapResponse,
  PoapsResponse,
} from '~/lib/types/poap';
import { PAGINATION_ALL_ITEMS } from '~/lib/values/general.values';

export const usePoapDropStore = defineStore('poapDrop', {
  state: () => ({
    poapDrops: {
      items: [] as PoapInterface[],
      loading: false,
      total: 0,
    },
    poapDrop: undefined as PoapInterface | undefined,
    dropReservations: {
      items: [] as PoapReservationInterface[],
      loading: false,
      total: 0,
    },
  }),

  getters: {},

  actions: {
    async getPoapDrops(args: FetchParams = {}) {
      this.poapDrops.loading = true;
      try {
        const params = parseArguments(args);
        // Get poap drops
        const { data } = await $api.get<PoapsResponse>('/poap-drops', params);
        this.poapDrops.items = data.items;
        this.poapDrops.total = data.total;
      } catch (e: any) {
        console.error(e);
        this.poapDrops.items = [];
        this.poapDrops.total = 0;
      }
      this.poapDrops.loading = false;
    },
    async getPoapDrop(dropId: number | string) {
      try {
        // Get poap drop
        const { data } = await $api.get<PoapResponse>(`/poap-drops/${dropId}`);
        this.poapDrop = data;
      } catch (e: any) {
        console.error(e);
      }
    },
    async getPoapDropReservations(dropId: number | string) {
      this.dropReservations.loading = true;
      try {
        const { data } = await $api.get<PoapReservationsResponse>(
          `/poap-drops/${dropId}/drop-reservations`,
          PAGINATION_ALL_ITEMS
        );
        this.dropReservations.items = data.items;
        this.dropReservations.total = data.total;
      } catch (e: any) {
        console.error(e);
        this.dropReservations.items = [];
        this.dropReservations.total = 0;
      }
      this.dropReservations.loading = false;
    },
  },
});

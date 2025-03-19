import { defineStore } from 'pinia';
import { WebStorageKeys } from '~/lib/values/general.values';

export const useUserStore = defineStore('user', {
  state: () => ({
    jwt: '',
    userId: 0,
    username: '',
    email: '',
  }),

  getters: {
    loggedIn(state) {
      return !!state.jwt;
    },
  },

  actions: {
    logout() {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(WebStorageKeys.USER);
      }

      $api.clearToken();
      this.$reset();
    },
  },

  persist: {
    key: WebStorageKeys.USER,
    storage: piniaPluginPersistedstate.localStorage(),
    pick: ['jwt', 'userId', 'username', 'email'],
  } as any,
});

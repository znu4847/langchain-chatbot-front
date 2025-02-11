import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loading: false,
  }),
  getters: {
    isLoading(state) {
      return state.loading
    },
  },
  actions: {
    on() {
      this.loading = true
    },
    off() {
      this.loading = false
    },
  },
})

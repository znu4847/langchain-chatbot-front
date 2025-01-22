import { defineStore } from 'pinia'
import { get, post, put, del } from '../utils/rest'
import { useUserStore } from './user'

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    items: [],
    pk: null,
  }),
  getters: {
    get(state) {
      return (pk) => {
        const item = state.items.find((item) => item.pk === pk)
        return item ? item : null
      }
    },
    currentItem() {
      return this.get(this.pk)
    },
    currentPk() {
      return this.pk
    },
  },
  actions: {
    select(pk) {
      this.pk = pk
    },
    async fetch() {
      // set itemst to the state
      const response = await get('/api/v1/conversations/')
      if (response.data && response.data.length > 0) {
        this.items = response.data
        this.pk = response.data[0].pk
      }
    },
    async create() {
      const userStore = useUserStore()
      const response = await post('/api/v1/conversations/', { user: userStore.userId })
      this.pk = response.data ? response.data.pk : null
      this.items = [...this.items, response.data]
    },
    async save(item) {
      const { data } = await put(`/api/v1/conversations/${item.pk}`, item)
      if (data) {
        this.items = this.items.map((i) => (i.pk === item.pk ? data : i))
      }
      // update item in items
    },
    async delete(pk) {
      const { data } = await del(`/api/v1/conversations/${pk}`)
      if (data) {
        this.items = this.items.filter((i) => i.pk !== pk)
      }
    },
  },
})

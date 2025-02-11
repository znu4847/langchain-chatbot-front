import { defineStore, acceptHMRUpdate } from 'pinia'
import { get, post, put, del } from '../utils/rest'

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
      if (response.data) {
        this.items = response.data || []
        this.pk = response.data[0]?.pk
      }
    },
    async create({ title, file }) {
      // Create FormData object
      const formData = new FormData()
      formData.append('title', title)
      formData.append('file', file)

      const headers = { 'Content-Type': 'multipart/form-data' }

      const response = await post('/api/v1/conversations/', formData, headers)
      console.debug(response)
      if (response.status === 201) {
        this.items.push(response.data)
        return response.data
      }
      return null

      // this.pk = response.data ? response.data.pk : null
      // this.items = [...this.items, response.data]
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConversationStore, import.meta.hot))
}

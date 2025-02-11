import { defineStore } from 'pinia'
import { get } from '../utils/rest'

export const useMessageStore = defineStore('message', {
  state: () => ({
    items: [],
    conversation: null,
  }),
  getters: {},
  actions: {
    async fetch(conversation) {
      if (!conversation) {
        console.error('conversation is required')
        return []
      }
      this.conversation = conversation
      const response = await get('/api/v1/messages/', { conversation: conversation })
      if (response.data) {
        this.conversation = conversation
        this.items = response.data
        return this.items
      }
    },
  },
})

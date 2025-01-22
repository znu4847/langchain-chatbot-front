import { defineStore } from 'pinia'

const testUser = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwayI6MiwidXNlcm5hbWUiOiJ0ZXN0X3VzZXIifQ.cmekmrCr98Us3r7nFPX0ozaAjby0PGVve1JOo-sQvqs',
  username: 'test_user',
  userId: 2,
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: testUser.token,
    username: testUser.username,
    userId: testUser.userId,
    conversations: [],
  }),
  getters: {},
  actions: {
    setToken(state, token) {
      state.token = token
    },
    setUsername(state, username) {
      state.username = username
    },
    async fetchConversations() {
      // fetch conversations from the server
      // and set them to the state
      console.log('fetching conversations...')
    },
  },
})

export default testUser

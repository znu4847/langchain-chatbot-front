import { defineStore, acceptHMRUpdate } from 'pinia'
import { post } from '../utils/rest'

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

export const useUserStore = defineStore('user', {
  state: () => ({
    initialized: false,
    token: '',
    username: '',
    // token: testUser.token,
    // username: testUser.username,
  }),
  getters: {
    isLoggedIn() {
      return this.username !== ''
    },
    isInitialized() {
      return this.initialized
    },
  },
  actions: {
    setToken(token) {
      console.debug('user.setToken')
      this.token = token
    },
    setUsername(username) {
      this.username = username
    },
    async logout() {
      if (!this.isLoggedIn) {
        return
      }
      console.debug('user.logout')
      this.token = ''
      this.username = ''
      // remove cookie
      document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    },
    async login({ username, password }) {
      const response = await post('/api/v1/users/login', { username, password })
      if (response.status === 200) {
        this.setUsername(response.data.username)
        this.setToken(response.data.jwt)
        console.debug('user.login::response.data.jwt: ' + response.data.jwt)
        document.cookie = `jwt=${response.data.jwt}; path=/; secure; samesite=strict`

        return true
      } else if (response.errors) {
        alert(response.errors)
      } else {
        alert('Failed to login.')
      }
      return false
    },
    async regist(form) {
      console.debug('user.regsit')
      console.debug('form', form)
      const response = await post('/api/v1/users/', form)
      if (response.status === 201) {
        console.debug(response)
        this.setToken(response.data.jwt)
        this.setUsername(response.data.username)
        return true
      } else if (response.errors) {
        alert(response.errors)
      } else {
        alert('Failed to register.')
      }
      return false
    },
    async initialize() {
      const token = getCookie('jwt')
      if (!token) {
        return
      }
      // Optionally, you can verify the token with the server
      const response = await post('/api/v1/users/verify', {}, { jwt: token })
      if (response?.status === 200) {
        this.setToken(token)
        this.setUsername(response.data.username)
      } else {
        console.debug('Token verification failed')
      }
      this.initialized = true
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}

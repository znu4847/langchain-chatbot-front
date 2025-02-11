<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const store = useUserStore()

async function login(e) {
  e.preventDefault()
  if (!username.value) {
    alert('input username')
    return
  }
  if (!password.value) {
    alert('input password')
    return
  }

  console.debug('login start')
  const success = await store.login({ username: username.value, password: password.value })
  if (success) {
    router.push('/')
    console.debug('login success')
  } else {
    console.debug('login failed')
  }
}
</script>
<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
          offset-md="4"
        >
          <v-card>
            <v-form @submit="login">
              <v-card-title>Login</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="username"
                  label="User Id"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  type="submit"
                >
                  Login
                </v-btn>
                <v-btn
                  color="primary"
                  @click="router.push('/regist')"
                >
                  Regist
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

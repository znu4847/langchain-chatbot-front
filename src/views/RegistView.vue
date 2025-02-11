<script setup>
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  username: '',
  password1: '',
  password2: '',
  email: '',
})
const store = useUserStore()

async function regist(e) {
  e.preventDefault()
  if (!form.username) {
    alert('input username')
    return
  }
  if (!form.password1) {
    alert('input password')
    return
  }
  if (form.password1 !== form.password2) {
    alert('password not match')
    return
  }
  const success = await store.regist({ ...form })
  if (success) {
    router.push('/')
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
            <v-form @submit="regist">
              <v-card-title>Regist</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="form.username"
                  label="User Id"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.name"
                  label="User Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.email"
                  label="email"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.password1"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.password2"
                  label="Password Confirm"
                  type="password"
                  required
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  type="submit"
                >
                  Regist
                </v-btn>
                <v-btn
                  color="primary"
                  @click="router.push('/login')"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

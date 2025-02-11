<script setup>
import { computed } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import AppConversations from '@/components/AppConversations.vue'
import AppProgress from '@/components/AppProgress.vue'
import { useLoadingStore } from './stores/loading'
import { useUserStore } from './stores/user'
const loadingStore = useLoadingStore()
const userStore = useUserStore()
const isLoading = computed(() => loadingStore.isLoading)
const isLoggedIn = computed(() => userStore.isLoggedIn)
const isInitialized = computed(() => userStore.isInitialized)
const username = computed(() => userStore.username)

const router = useRouter()
function logout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <v-app id="inspire">
    <!--
    <v-system-bar>
      <v-spacer></v-spacer>

      <v-icon>mdi-square</v-icon>

      <v-icon>mdi-circle</v-icon>

      <v-icon>mdi-triangle</v-icon>
    </v-system-bar>
    -->

    <!--
    <v-navigation-drawer
      color="grey-lighten-3"
      rail
    >
      <v-avatar
        class="d-block text-center mx-auto mt-4"
        color="grey-darken-1"
        size="36"
      ></v-avatar>

      <v-divider class="mx-3 my-5"></v-divider>

      <v-avatar
        v-for="n in 6"
        :key="n"
        class="d-block text-center mx-auto mb-9"
        color="grey-lighten-1"
        size="28"
      ></v-avatar>
    </v-navigation-drawer>
    -->

    <AppConversations v-if="isInitialized && isLoggedIn" />

    <v-app-bar
      class="px-3"
      color="grey-lighten-4"
      height="72"
      flat
    >
      <v-spacer></v-spacer>

      <v-responsive max-width="150">
        <span v-if="isLoggedIn">{{ username }}</span>
        <v-tooltip
          v-if="isLoggedIn"
          location="bottom"
          text="Logout"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              v-bind="props"
              @click="logout"
            >
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-responsive>
    </v-app-bar>

    <RouterView />
    <app-progress :loading="isLoading" />
  </v-app>
</template>

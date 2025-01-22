<script setup>
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import AppConversations from './components/AppConversations.vue'
import { useConversationStore } from './stores/conversation'

const conversationStore = useConversationStore()

const conversation = computed(() => conversationStore.pk)
</script>

<template>
  <v-app id="inspire">
    <v-system-bar>
      <v-spacer></v-spacer>

      <v-icon>mdi-square</v-icon>

      <v-icon>mdi-circle</v-icon>

      <v-icon>mdi-triangle</v-icon>
    </v-system-bar>

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

    <AppConversations />

    <v-app-bar
      class="px-3"
      color="grey-lighten-4"
      height="72"
      flat
    >
      <v-spacer></v-spacer>

      <v-responsive max-width="156">
        <v-text-field
          bg-color="grey-lighten-1"
          density="compact"
          rounded="pill"
          variant="solo-filled"
          flat
          hide-details
          :value="conversation"
        ></v-text-field>
      </v-responsive>
    </v-app-bar>

    <RouterView />
  </v-app>
</template>

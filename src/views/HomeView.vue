<script setup></script>

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

    <v-navigation-drawer width="244">
      <v-sheet
        color="grey-lighten-5"
        height="128"
        width="100%"
      ></v-sheet>

      <v-list>
        <v-list-item
          v-for="n in 5"
          :key="n"
          :title="`Item ${n}`"
          link
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

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
        ></v-text-field>
      </v-responsive>
    </v-app-bar>

    <v-main>
      <div class="chat-container">
        <div
          class="message-history"
          ref="messageHistoryBox"
        >
          <div
            v-for="(message, index) in messageHistory"
            :key="index"
            :class="['message', message.type]"
            :ref="(el) => setMessageWidth(el, message.text)"
          >
            {{ message.text }}
          </div>
        </div>
      </div>
    </v-main>

    <v-footer app>
      <v-textarea
        bg-color="grey-lighten-1"
        class="overflow-auto"
        density="compact"
        variant="filled"
        auto-grow
        flat
        hide-details
        rows="1"
        v-model="newMessage"
        @keydown="handleKeyDown"
      ></v-textarea>
    </v-footer>
  </v-app>
</template>

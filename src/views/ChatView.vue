<script setup>
import { computed, watch, onUnmounted, ref, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { useConversationStore } from '@/stores/conversation'
import { useMessageStore } from '@/stores/message'

const userStore = useUserStore()

const newMessage = ref('')
const pendingMessage = ref('')
const messageHistory = ref([])

const chatDisabled = ref(false)
const conversationStore = useConversationStore()
const conversation = computed(() => conversationStore.currentPk)

const messageStore = useMessageStore()

const socket = ref(null)
watch(conversation, async () => {
  newMessage.value = ''
  console.debug('conversation.watch:: changed')
  if (!conversation.value || conversation.value === -1) {
    console.debug('conversation.watch:: invalid conversation')
    messageHistory.value = []
    return
  }
  messageHistory.value = await messageStore.fetch(conversation.value)
  socketInitialize(conversation.value)
  await nextTick()
  scrollToBottom()
})

function socketInitialize() {
  console.debug('socketInitialize:: changed')
  if (socket.value) {
    console.debug('socketInitialize:: close socket')
    // close the connection when the component is unmounted
    socket.value.close()
  }

  socket.value = new WebSocket(
    `ws://localhost:8000/ws/v1/chat/?jwt=${userStore.token}&conversation=${conversation.value}`,
  )
  socket.value.onmessage = (event) => {
    try {
      console.debug('socket.onmessage:: ', event)
      if (!event.data) {
        console.debug('no data')
        return
      }

      const data = JSON.parse(event.data)
      pendingMessage.value = data.message
      if (data.pending) {
        return
      }

      chatDisabled.value = false
      messageHistory.value.push({
        role: 'ai',
        text: pendingMessage.value,
      })
      pendingMessage.value = ''
      nextTick(scrollToBottom)
    } catch (e) {
      console.error(e)
      chatDisabled.value = false
    }
  }
}

/*** functions ***/
async function sendMessage() {
  if (!socket.value || newMessage.value.trim() === '') {
    return
  }

  // send message to the server
  chatDisabled.value = true
  socket.value.send(JSON.stringify({ role: 'human', message: newMessage.value }))

  messageHistory.value.push({
    role: 'human',
    text: newMessage.value,
  })
  newMessage.value = ''
  await nextTick()
  scrollToBottom()
}

function handleKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    sendMessage()
    event.preventDefault()
  }
}

function scrollToBottom() {
  // scroll to the bottom of the chat window
  const messageHistoryBox = document.querySelector('.message-history')
  if (messageHistoryBox) {
    messageHistoryBox.scrollTop = messageHistoryBox.scrollHeight
  }
}

function setMessageWidth(el, text) {
  if (!el) {
    return
  }

  const maxWidth = el.parentElement.clientWidth * 0.7
  const minWidth = 50 // Minimum width in pixels
  const charWidth = 8 // Approximate width of a character in pixels

  const calculatedWidth = Math.min(maxWidth, Math.max(minWidth, text.length * charWidth + 23))
  el.style.width = `${calculatedWidth}px`
}

onUnmounted(() => {
  if (socket.value) {
    // close the connection when the component is unmounted
    socket.value.close()
  }
})
</script>
<template>
  <v-main>
    <div class="chat-container">
      <div
        class="message-history"
        ref="messageHistoryBox"
      >
        <div
          v-for="(message, index) in messageHistory"
          :key="index"
          :class="['message', message.role]"
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
      :disabled="chatDisabled || !conversation || conversation === -1"
    ></v-textarea>
  </v-footer>
</template>
<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80vh;
  padding: 20px;
}
.message-history {
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 5px;
  max-width: 70%;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message.human {
  background-color: #ffeb3b;
  align-self: flex-end;
  color: black;
  margin-left: auto;
}

.message.ai {
  background-color: #ffffff;
  align-self: flex-start;
  color: black;
}

.input-container {
  display: flex;
  align-items: center;
}
</style>

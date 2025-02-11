<script setup>
import { ref, watch, reactive } from 'vue'
import { useConversationStore } from '@/stores/conversation'
import { useLoadingStore } from '@/stores/loading'

const store = useConversationStore()
const loadingStore = useLoadingStore()

// define models
const emits = defineEmits(['update:modelValue', 'update:conversation'])
const model = defineModel()
const localValue = ref(model)
const form = reactive({
  title: '',
  file: null,
})
watch(model, (value) => {
  localValue.value = value
  loadingStore.off()
  form.title = ''
  form.file = null
})
watch(localValue, (value) => {
  emits('update:modelValue', value)
})

async function save() {
  if (form.title === '') {
    alert('input title')
    return
  }
  loadingStore.on()
  try {
    const newConveration = await store.create({ title: form.title, file: form.file })
    if (newConveration == null) {
      throw new Error('Creating new conversation is failed')
    }
    emits('update:conversation', newConveration)
    close()
  } catch (e) {
    console.error(e)
    alert('Creating new conversation is failed')
  } finally {
    loadingStore.off()
  }
}

function close() {
  form.title = ''
  form.file = null
  emits('update:modelValue', false)
}
</script>
<template>
  <v-dialog
    v-model="localValue"
    max-width="700px"
  >
    <v-card>
      <v-card-title>New Conversation</v-card-title>
      <v-form ref="new-conversation-form">
        <v-card-text>
          <v-text-field
            v-model="form.title"
            label="Title"
          ></v-text-field>
        </v-card-text>
        <v-card-text>
          <v-file-input
            v-model="form.file"
            label="Pdf"
            accept=".pdf"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

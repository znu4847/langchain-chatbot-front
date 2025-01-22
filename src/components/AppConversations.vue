<script setup>
import { ref, onMounted } from 'vue'
import { useConversationStore } from '@/stores/conversation'

const store = useConversationStore()
const items = ref([])
const editItem = ref(null)
const edit = ref(false)
const editItemEmpty = { title: '' }

async function select(item) {
  store.select(item.pk)
  // if (item.pk === -1) {
  //   console.log('new conversation')
  //   // await store.create()
  // } else {
  //   store.select(item.pk)
  // }
}

async function action({ pk, type }) {
  console.log('action:: ', type, pk)
  if (type === 'delete') {
    await store.delete(pk)
    initialize()
  } else if (type === 'new') {
    await store.create()
    initialize()
  } else if (type === 'edit') {
    const item = store.get(pk)
    console.log('is editable ? ', item)
    if (!item) {
      console.log('item not found')
      return
    }
    edit.value = true
    editItem.value = { ...item }
  } else {
    console.log('unknown action : ', type)
  }
}
function initialize() {
  editItem.value = editItemEmpty
  items.value = [...store.items]
  items.value.forEach((item) => {
    item.value = item.pk
    item.actions = [
      {
        pk: item.pk,
        type: 'edit',
        icon: 'mdi-pencil',
      },
      {
        pk: item.pk,
        type: 'delete',
        icon: 'mdi-close',
      },
    ]
  })
  items.value.push({
    pk: -1,
    value: -1,
    title: 'New conversation',
    actions: [
      {
        pk: -1,
        type: 'new',
        icon: 'mdi-plus',
      },
    ],
  })
}
async function save() {
  await store.save(editItem.value)
  edit.value = false
  initialize()
}
onMounted(() => {
  console.log('App.vue::mounted')
  store.fetch().then(initialize)
})
</script>
<template>
  <v-navigation-drawer width="244">
    <v-sheet
      color="grey-lighten-5"
      height="128"
      width="100%"
    ></v-sheet>
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.pk"
        :value="item.pk"
        link
        @click="select(item)"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        <template v-slot:append>
          <template
            v-for="actionItem in item.actions"
            :key="actionItem.type"
          >
            <v-btn
              variant="plain"
              :icon="actionItem.icon"
              @click="action(actionItem)"
            >
            </v-btn>
          </template>
        </template>
      </v-list-item>
    </v-list>
    <v-dialog
      v-model="edit"
      max-width="700"
    >
      <v-card>
        <v-card-title>Edit conversation</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editItem.title"
            label="Title"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="save"
          >
            Save
          </v-btn>
          <v-btn
            color="error"
            @click="edit = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

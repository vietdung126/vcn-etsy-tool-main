<script setup>
import { ref, reactive, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useLinkDesignStore } from '../store'

const toast = useToast()
function showError(error) {
  toast.error('LỖI: ' + error.message || error, { duration: 5000 })
}

const props = defineProps({
  groupId: {
    type: String,
    required: true,
  },
})

const linkDesignStore = useLinkDesignStore()
const dialog = ref(false)
const form = ref(null)
const valid = ref(true)

watch(dialog, value => !value && clearForm())

const formData = reactive({
  sku: undefined,
  link: undefined,
})

function required(v) {
  return !!v || 'Không được để trống'
}

async function submit() {
  linkDesignStore
    .create({ ...formData, groupId: props.groupId })
    .then(() => toast.success('Tạo mới thành công'), showError)
  dialog.value = false
}

function clearForm() {
  formData.sku = undefined
  formData.link = undefined
}
</script>

<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="500">
    <template v-slot:activator="{ props }">
      <v-btn @click="dialog = true" v-bind="props">
        <v-icon start icon="mdi-plus"></v-icon>Tạo mới</v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Tạo mới SKU-Link Design</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.sku"
                  label="SKU *"
                  density="compact"
                  variant="underlined"
                  :rules="[required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.link"
                  label="Link *"
                  density="compact"
                  variant="underlined"
                  :rules="[required]"
                ></v-text-field>
              </v-col>
            </v-row>
            <small>* Trường bắt buộc</small>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false"> Thoát </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="submit" :disabled="!valid"> Lưu </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

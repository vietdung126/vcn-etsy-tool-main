<script setup>
import { ref, reactive, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useUserStore } from '../store'

const toast = useToast()
function showError(error) {
  toast.error('LỖI: ' + error.message || error, { duration: 5000 })
}

const userStore = useUserStore()
const dialog = ref(false)
const form = ref(null)
const valid = ref(true)

watch(dialog, value => !value && clearForm())

const formData = reactive({
  username: undefined,
  password: undefined,
  fullName: undefined,
})

function required(v) {
  return !!v || 'Không được để trống'
}

async function submit() {
  userStore.create(formData).then(() => toast.success('Tạo người dùng thành công'), showError)
  dialog.value = false
}

function clearForm() {
  formData.username = undefined
  formData.password = undefined
  formData.fullName = undefined
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
        <span class="text-h5">Tạo người dùng</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.username"
                  label="Tên đăng nhập *"
                  density="compact"
                  variant="underlined"
                  :rules="[required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.fullName"
                  label="Họ và tên *"
                  density="compact"
                  variant="underlined"
                  :rules="[required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.password"
                  label="Mật khẩu *"
                  density="compact"
                  variant="underlined"
                  :rules="[required]"
                  min="6"
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

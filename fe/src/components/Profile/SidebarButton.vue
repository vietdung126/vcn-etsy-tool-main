<script setup>
import * as authService from '@/services/auth'
import { ref, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'
import logo from '@/assets/images/avatar.png'

const toast = useToast()
function showError(message) {
  toast.error('LỖI: ' + message, { duration: 5000 })
}

const sidebarStore = useSidebarStore()
const router = useRouter()

const rail = ref(false)
const profile = ref({})
const passwordDialog = ref(false)

const changePasswordForm = ref({
  valid: false,
  oldPassword: undefined,
  password: undefined,
  rePassword: undefined,
})

onMounted(() => {
  const sProfile = sessionStorage.getItem('profile')
  profile.value = sProfile ? JSON.parse(sProfile) : {}
})

watch(passwordDialog, () => {
  changePasswordForm.value.valid = false
  changePasswordForm.value.oldPassword = undefined
  changePasswordForm.value.password = undefined
  changePasswordForm.value.rePassword = undefined
})

watch(
  () => changePasswordForm.value.password,
  () => {
    changePasswordForm.value.rePassword = undefined
  },
)

watch(rail, val => {
  sidebarStore.setRail(val)
})

function logout() {
  sessionStorage.clear()
  router.push('/login')
}

function changePassword() {
  authService
    .changePassword({
      currentPassword: changePasswordForm.value.oldPassword,
      newPassword: changePasswordForm.value.password,
    })
    .then(() => {
      toast.success('Đặt lại mật khẩu thành công')
      passwordDialog.value = false
      sessionStorage.clear()
      router.push('/login')
    })
    .catch(error => {
      if (error.code == 412) {
        toast.error('Mật khẩu hiện tại không đúng')
      } else {
        showError(error)
      }
    })
}

function required(v) {
  return !!v || 'Không được để trống'
}
function minLength(min) {
  return (v = '') => (v?.length < 6 ? `Cần nhập tối thiểu ${min} kí tự` : true)
}
function samePassword(v) {
  return (
    (v && changePasswordForm.value.password === changePasswordForm.value.rePassword) ||
    'Mật khẩu mới không trùng khớp'
  )
}

function onClickedPinButton(event) {
  event.preventDefault()
  event.stopPropagation()
  rail.value = !rail.value
}
</script>

<template>
  <div>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-list-item :prepend-avatar="logo" nav v-bind="props">
          <v-list-item-title>
            {{ profile.fullName }}
          </v-list-item-title>
          <template v-slot:append>
            <v-btn
              variant="text"
              :icon="'mdi-chevron-' + (rail ? 'right' : 'left')"
              @click="onClickedPinButton"
            ></v-btn>
          </template>
        </v-list-item>
      </template>
      <v-list>
        <v-list-item
          value="change-password"
          prepend-icon="mdi-lock-outline"
          title="Đổi mật khẩu"
          @click="passwordDialog = true"
        >
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item prepend-icon="mdi-logout" value="logout" title="Đăng xuất" @click="logout">
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog v-model="passwordDialog" width="50%" min-width="300px" max-width="500px">
      <v-card>
        <v-card-title>Đổi mật khẩu</v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-form
            ref="form"
            v-model="changePasswordForm.valid"
            validate-on="blur"
            @submit.prevent="true"
          >
            <v-text-field
              label="Mật khẩu cũ"
              v-model="changePasswordForm.oldPassword"
              density="compact"
              variant="outlined"
              type="password"
              :rules="[required, minLength(6)]"
            ></v-text-field>
            <v-divider></v-divider>
            <v-text-field
              label="Mật khẩu mới"
              v-model="changePasswordForm.password"
              density="compact"
              variant="outlined"
              type="password"
              :rules="[required, minLength(6)]"
            ></v-text-field>
            <v-text-field
              label="Nhập lại khẩu mới"
              v-model="changePasswordForm.rePassword"
              density="compact"
              variant="outlined"
              type="password"
              :rules="[required, minLength(6), samePassword]"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="passwordDialog = false">
            Close
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            :disabled="!changePasswordForm.valid"
            @click="changePassword"
          >
            Lưu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

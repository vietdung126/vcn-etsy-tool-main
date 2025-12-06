<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useSessionStore } from '@/stores/session'
import { useLoadingStore } from './stores/loading'

import * as AuthApi from '@/services/auth'
// eslint-disable-next-line no-unused-vars

const loadingStore = useLoadingStore()
const sessionStore = useSessionStore()

const router = useRouter()

const isLoaded = sessionStore.getLoaded

onMounted(async () => {
  sessionStore.loadRole()
  const token = sessionStorage.getItem('at')
  if (!token) {
    router.push({ name: 'login' })
    return
  }
})
</script>

<template>
  <router-view />
  <v-dialog width="100%" height="100%" :model-value="true" v-if="loadingStore.loading">
    <div class="w-100 h-100 d-flex justify-center align-center text-center" style="display: inline">
      <div class="w-25">
        <v-progress-circular rounded indeterminate color="primary"></v-progress-circular>
      </div>
    </div>
  </v-dialog>
  <!-- <BbsLoading /> -->
</template>

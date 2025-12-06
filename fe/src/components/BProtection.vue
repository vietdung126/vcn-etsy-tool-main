<script setup>
import { ref, watch, onMounted } from 'vue'
import { useSessionStore } from '@/stores/session'

const props = defineProps({
  allowRoles: Array,
})
const sessionStore = useSessionStore()

const isAllowed = ref(false)

onMounted(() => {
  checkPermission()
})

watch(
  () => props.allowRoles,
  () => {
    checkPermission()
  },
  { deep: true },
)

function checkPermission() {
  isAllowed.value = false
  const myRole = sessionStorage.getItem('role')

  if (!myRole) {
    isAllowed.value = false
  } else {
    if (props.allowRoles.includes(myRole)) {
      isAllowed.value = true
      return
    }
  }
}
</script>

<template>
  <slot v-if="isAllowed"></slot>
  <slot v-else name="denied"></slot>
</template>

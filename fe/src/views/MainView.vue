<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const theme = ref('light')
const { mobile } = useDisplay()
const showSidebar = ref(!mobile.value)
</script>

<template>
  <v-app :theme="theme" class="overscroll-none">
    <BSidebar v-model="showSidebar" />
    <v-main style="background-color: #eee">
      <v-app-bar>
        <v-app-bar-nav-icon
          v-if="mobile"
          variant="text"
          @click.stop="showSidebar = !showSidebar"
        ></v-app-bar-nav-icon>
        <router-view name="header_bar" />
        <!-- <v-spacer></v-spacer>
        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="onClick"
          >Toggle Theme</v-btn
        > -->
      </v-app-bar>

      <v-container fluid style="height: 100%" :class="{ 'pa-0': mobile }">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.overscroll-none {
  overscroll-behavior-x: none;
}
</style>

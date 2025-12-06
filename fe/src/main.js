/* eslint-disable no-undef */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import VueGoodTablePlugin from 'vue-good-table-next'
import Toaster, { POSITION } from 'vue-toastification'
import Datepicker2 from '@vuepic/vue-datepicker'
import Datepicker from 'vue3-datepicker'
import VueViewer from 'v-viewer'
import VueExcelEditor from 'vue3-excel-editor'

// import the styles
import 'vue-good-table-next/dist/vue-good-table-next.css'
import '@vuepic/vue-datepicker/dist/main.css'
import '@/assets/main.css'
import 'viewerjs/dist/viewer.css'

import { registerComponents } from './components'

import VueHtmlToPaper from './plugins/VueHtmlToPaper'

var toasterConfigs = {
  // position: 'top-right',
  // duration: 2000,
  position: POSITION.TOP_RIGHT,
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
}

loadFonts()
const pinia = createPinia()

const app = createApp(App)

app
  .use(router)
  .use(vuetify)
  .use(pinia)
  .use(VueViewer, {
    defaultOptions: {
      zIndex: 9999,
      toolbar: false,
      navbar: false,
      title: false,
      transition: false,
    },
  })
  .use(VueExcelEditor)
  .use(VueGoodTablePlugin)
  .use(VueHtmlToPaper)
  .provide('htmlToPaper', app.config.globalProperties.$htmlToPaper)
  .use(Toaster, toasterConfigs)
  .provide('toast', app.config.globalProperties.$toast)

app.component('DatePicker', Datepicker).component('DatePicker2', Datepicker2)

registerComponents(app)

app.mount('#app')

// load data
const accessToken = sessionStorage.getItem('at')

if (accessToken) {
  //   await useCategoryStore().reload()
}

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

export default createVuetify({
  blueprint: md3,
  theme: {
    options: { customProperties: true },
  },
})
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

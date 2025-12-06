import Sidebar from './BSidebar.vue'
import Protection from './BProtection.vue'

export function registerComponents(app) {
  app.component('BSidebar', Sidebar).component('BProtection', Protection)
}

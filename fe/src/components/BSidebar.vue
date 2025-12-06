<script setup>
import { ref, onMounted } from 'vue'
import { ROLE } from '@/configs/role'
import SidebarButton from './Profile/SidebarButton.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { storeToRefs } from 'pinia'

const props = defineProps({})

const sidebarStore = useSidebarStore()

const { rail } = storeToRefs(sidebarStore)
const profile = ref({})

onMounted(() => {
  const sProfile = sessionStorage.getItem('profile')
  profile.value = sProfile ? JSON.parse(sProfile) : {}
})

const menuItems = [
  {
    items: [
      {
        prependIcon: 'mdi-microsoft-excel ',
        title: 'Chuyển đổi',
        value: 'transform',
        to: '/main/transform',
        roles: [ROLE.ADMIN, ROLE.MEMBER],
      },
      {
        prependIcon: 'mdi-package-variant-closed',
        title: 'SPU',
        value: 'spu',
        to: '/main/skuspu',
        roles: [ROLE.ADMIN, ROLE.MEMBER],
      },
      {
        prependIcon: 'mdi-link',
        title: 'Link Design',
        value: 'link-design',
        to: '/main/link-design',
        roles: [ROLE.ADMIN, ROLE.MEMBER],
      },
      {
        prependIcon: 'mdi-storefront-outline',
        title: 'Kho',
        value: 'store',
        to: '/main/store',
        roles: [ROLE.ADMIN, ROLE.MEMBER],
      },
    ],
    roles: [ROLE.ADMIN, ROLE.MEMBER],
  },
  {
    items: [
      {
        prependIcon: 'mdi-account-outline',
        title: 'Người dùng',
        value: 'user',
        to: '/main/user',
        roles: [ROLE.ADMIN],
      },
    ],
    roles: [ROLE.ADMIN],
  },
]
</script>

<template>
  <v-navigation-drawer expand-on-hover :rail="rail" v-bind="props">
    <div class="w-100 h-100 overflow-y-auto scrollbar-11">
      <v-list density="compact" nav>
        <SidebarButton />

        <v-divider></v-divider>
        <template v-for="(group, i) in menuItems" :key="i">
          <template v-for="(item, j) in group.items" :key="j">
            <BProtection v-if="item.roles" :allowRoles="item.roles">
              <v-list-item
                :prepend-icon="item.prependIcon"
                :title="item.title"
                :value="item.value"
                :to="item.to"
              ></v-list-item>
            </BProtection>
            <v-list-item
              v-else
              :prepend-icon="item.prependIcon"
              :title="item.title"
              :value="item.value"
              :to="item.to"
            ></v-list-item>
          </template>

          <BProtection v-if="!!group.roles" :allowRoles="group.roles">
            <v-divider class="pb-1"></v-divider>
          </BProtection>
        </template>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

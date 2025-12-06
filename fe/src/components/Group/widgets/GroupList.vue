<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { storeToRefs } from 'pinia'
import AppEditForm from '../../SkuSpu/widgets/EditForm.vue'
import GroupEditForm from './EditForm.vue'
import GroupCreateForm from './CreateForm.vue'
import { useStoreStore } from '../../Store/store'
import { useGroupStore } from '../store'

const toast = useToast()
function showError(error) {
  GroupCreateForm
  toast.error('LỖI: ' + error.message || error, { duration: 5000 })
}

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['onSelectedGroup'])

const storeStore = useStoreStore()
const groupStore = useGroupStore()
const { items: storeItems } = storeToRefs(storeStore)
const selectedStore = ref({})
const selectedGroup = ref({})
const refStoreEditForm = ref()
const refGroupCreateForm = ref()
const refGroupEditForm = ref()
const confirmationDialog = ref(false)

function createGroup(row) {
  selectedStore.value = row
  setTimeout(() => {
    refGroupCreateForm.value.showDialog(row.id)
  }, 10)
}

const actions = [
  {
    text: 'Sửa',
    icon: 'mdi-pencil',
    color: 'orange',
    onClick: (event, row) => {
      onSelectedGroup(row)
      setTimeout(() => {
        refGroupEditForm.value.showDialog()
      })
    },
  },
  {
    text: 'Xóa',
    icon: 'mdi-delete-outline',
    color: 'red',
    onClick: (event, item) => {
      event.stopPropagation()
      confirmationDialog.value = true
    },
  },
]

onMounted(() => {
  storeStore.load().catch(showError)
  groupStore.load().catch(showError)
})

function onSelectedGroup(group) {
  if (group.id == selectedGroup.value?.id) {
    selectedGroup.value = null
    emit('onSelectedGroup', null)
  } else {
    selectedGroup.value = group
    emit('onSelectedGroup', group)
  }
}

function deleteGroup() {
  groupStore.deleteById(selectedGroup.value.id).then(result => {
    confirmationDialog.value = false
    return result
      ? toast.success(`Đã xóa folder "${selectedGroup.value.name}".`)
      : toast.warning(`Không thể xóa folder "${selectedGroup.value.name}".`)
  }, showError)
}
</script>

<template>
  <div>
    <div>
      <!-- <AppEditForm :data="selectedApp" ref="refAppEditForm" /> -->
      <GroupEditForm :data="selectedGroup" ref="refGroupEditForm" v-if="!!selectedGroup?.id" />
    </div>

    <v-list density="comfortable">
      <div v-for="(store, index) in storeItems" :key="`d${index}`">
        <v-divider v-show="index !== 0"></v-divider>

        <v-list-group :value="store.id" density="comfortable">
          <template v-slot:activator="{ props }">
            <v-list-item
              :title="store.name"
              v-bind="props"
              prepend-icon="mdi-storefront-outline"
              density="comfortable"
              :class="{ 'store-active': selectedGroup?.storeId === store.id }"
            >
              <template v-slot:append>
                <v-btn
                  density="comfortable"
                  variant="flat"
                  icon="mdi-plus-thick"
                  color="white"
                  @click="
                    event => {
                      event.stopPropagation()
                      createGroup(store)
                    }
                  "
                  class="btn-add"
                />
              </template>
            </v-list-item>
          </template>
          <v-list-item
            :title="group.name"
            v-for="group in groupStore.getByStoreIdAndType(store.id, type)"
            :key="`s${group.id}`"
            :active="selectedGroup?.id === group.id"
            @click="() => onSelectedGroup(group)"
            prepend-icon="mdi-folder-outline"
            class="service-item"
            active-class="group-active"
            density="comfortable"
          >
            <template v-slot:append>
              <span class="service-actions">
                <v-btn
                  v-for="(action, i) in actions"
                  :key="i"
                  :value="action"
                  @click="event => action.onClick(event, group)"
                  :icon="action.icon"
                  :color="action.color"
                  density="comfortable"
                  variant="plain"
                  size="small"
                  class="pa-0"
                  style="height: 24px; width: 36px"
                ></v-btn>
              </span>
            </template>
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
    <GroupCreateForm
      ref="refGroupCreateForm"
      :store-id="selectedStore?.id"
      :type="type"
      :btn-create="false"
      v-if="!!selectedStore?.id"
    />

    <v-dialog v-model="confirmationDialog" max-width="400">
      <v-card
        prepend-icon="mdi-trash-can-outline"
        :text="'Bạn có chắc chắn muốn xóa folder ' + selectedGroup?.name + ' không?'"
        :title="'Xác nhận xóa folder'"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="confirmationDialog = false"> Thoát </v-btn>
          <v-btn @click="deleteGroup"> Xác nhận </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.action-top {
  margin-bottom: 16px;
  display: flex;
}
.mdi-delete-outline {
  color: red;
}
.mdi-pencil {
  color: orange;
}

.service-item .service-actions {
  display: none;
}

.service-item:hover .service-actions {
  display: inline;
}

.group-active {
  background: orange;
  color: whitesmoke;
}

.store-active {
  font-weight: bold;
  color: orange;
}

.btn-add {
  color: orange !important;
}
</style>

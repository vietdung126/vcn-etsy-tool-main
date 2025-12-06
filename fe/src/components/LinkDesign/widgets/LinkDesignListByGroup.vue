<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { storeToRefs } from 'pinia'
import CreateForm from './CreateForm.vue'
import EditForm from './EditForm.vue'
import { useLinkDesignStore } from '../store'

const toast = useToast()
function showError(error) {
  toast.error('LỖI: ' + error.message || error, { duration: 5000 })
}

const props = defineProps({
  groupId: {
    type: String,
  },
  btnCreate: {
    type: Boolean,
    default: true,
  },
})

const skuLinkStore = useLinkDesignStore()
const { allItems: items } = storeToRefs(skuLinkStore)
const selectedItem = ref({})
const editForm = ref()
const confirmationDialog = ref(false)

const actions = [
  {
    text: 'Sửa',
    icon: 'mdi-pencil',
    color: 'orange',
    onClick: row => {
      selectedItem.value = row
      editForm.value.showDialog()
    },
  },
  {
    text: 'Ẩn',
    icon: 'mdi-delete-outline',
    color: 'red',
    onClick: row => {
      selectedItem.value = row
      confirmationDialog.value = true
    },
  },
]

onMounted(() => {
  skuLinkStore.load().catch(showError)
})

const columns = [
  {
    label: 'SKU',
    field: 'sku',
    width: '200px',
  },
  {
    label: 'Link',
    field: 'link',
  },
  {
    label: 'Thao tác',
    field: 'action',
    tdClass: 'text-right',
    thClass: 'text-right',
    globalSearchDisabled: true,
    sortable: false,
  },
]

function deleteItem() {
  skuSpuStore.deleteById(selectedItem.value.id).then(result => {
    confirmationDialog.value = false
    const name = `${selectedItem.value.sku} - ${selectedItem.value.link}`

    return result
      ? toast.success(`Đã xóa cặp "${name}".`)
      : toast.warning(`Không thể xóa cặp "${name}".`)
  }, showError)
}
</script>

<template>
  <div>
    <div class="action-top" v-if="btnCreate">
      <CreateForm :groupId="groupId" />
    </div>
    <EditForm :data="selectedItem" ref="editForm" :store="selectedItem" />

    <vue-good-table
      :columns="columns"
      :rows="skuLinkStore.getByGroupId(groupId)"
      styleClass="vgt-table condensed"
      :search-options="{
        enabled: true,
        placeholder: 'Tìm SKU-Link',
      }"
    >
      <template v-slot:table-row="row">
        <span v-if="row.column.field == 'action'">
          <v-btn
            v-for="(item, i) in actions"
            :key="i"
            :value="item"
            @click="() => item.onClick(row.row)"
            :icon="item.icon"
            :color="item.color"
            variant="plain"
            size="small"
            class="pa-0"
            style="height: 24px; width: 36px"
          ></v-btn>
        </span>
        <span v-else-if="row.column.field == 'isDeleted'">
          <span>
            <v-icon v-if="row.row.isDeleted == true" icon="mdi-flag" color="red"></v-icon
            ><span v-else></span
          ></span>
        </span>
        <span v-else>
          <span>{{ row.formattedRow[row.column.field] }}</span>
        </span>
      </template>
    </vue-good-table>

    <v-dialog v-model="confirmationDialog" max-width="400">
      <v-card
        prepend-icon="mdi-trash-can-outline"
        :text="
          'Bạn có chắc chắn muốn xóa cặp ' +
          `${selectedItem.sku} - ${selectedItem.link}` +
          ' không?'
        "
        :title="'Xác nhận xóa SKU-Link Design'"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="confirmationDialog = false"> Thoát </v-btn>
          <v-btn @click="deleteItem"> Xác nhận </v-btn>
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
</style>

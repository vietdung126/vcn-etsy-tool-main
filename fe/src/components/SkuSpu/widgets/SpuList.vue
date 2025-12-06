<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { storeToRefs } from 'pinia'
import CreateForm from './CreateForm.vue'
import EditForm from './EditForm.vue'
import { useSkuSpuStore } from '../store'

const toast = useToast()
function showError(error) {
  toast.error('LỖI: ' + error.message || error, { duration: 5000 })
}

const skuSpuStore = useSkuSpuStore()
const { allItems: stores } = storeToRefs(skuSpuStore)
const selectedUser = ref({})
const editForm = ref()

const items = [
  {
    text: 'Sửa',
    icon: 'mdi-pencil',
    color: 'orange',
    onClick: row => {
      selectedUser.value = row
      editForm.value.showDialog()
    },
  },
  {
    text: 'Ẩn',
    icon: 'mdi-delete-outline',
    color: 'red',
    onClick: row => {
      skuSpuStore
        .deleteById(row.id)
        .then(
          result =>
            result
              ? toast.success(`Đã xóa SKU-SPU "${row.sku}-${row.spu}".`)
              : toast.warning(`Không thể xóa SKU-SPU "${row.sku}-${row.spu}".`),
          showError,
        )
    },
  },
]

onMounted(() => {
  skuSpuStore.load().catch(showError)
})

const columns = [
  {
    label: 'SKU',
    field: 'sku',
  },
  {
    label: 'SPU',
    field: 'spu',
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
</script>

<template>
  <div>
    <div class="action-top">
      <CreateForm />
      <EditForm :data="selectedUser" ref="editForm" :store="selectedUser" />
    </div>

    <vue-good-table
      :columns="columns"
      :rows="stores"
      styleClass="vgt-table condensed"
      :search-options="{
        enabled: true,
        placeholder: 'Tìm SKU-SPU',
      }"
    >
      <template v-slot:table-row="row">
        <span v-if="row.column.field == 'action'">
          <v-btn
            v-for="(item, i) in items"
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

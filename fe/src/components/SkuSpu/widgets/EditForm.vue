<script setup>
import { ref, reactive, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useSkuSpuStore } from '../store'

const toast = useToast()
function showError(error) {
  toast.error('LỖI: ' + error.message || error, { duration: 5000 })
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => {},
  },
})

defineExpose({ showDialog })

const skuSpuStore = useSkuSpuStore()
const dialog = ref(false)
const form = ref(null)
const valid = ref(true)

watch(dialog, value => {
  if (value) {
    const store = props.data

    Object.keys(formData).forEach(key => {
      formData[key] = store[key]
    })
  } else {
    clearForm()
  }
})

const formData = reactive({
  sku: undefined,
  spu: undefined,
})

function clearForm() {
  formData.sku = undefined
  formData.spu = undefined
}

function required(v) {
  return !!v || 'Không được để trống'
}

async function submit() {
  const store = props.data
  const updatedFields = {}

  Object.keys(formData).forEach(key => {
    if (formData[key] !== store[key]) {
      updatedFields[key] = formData[key]
    }
  })

  if (Object.keys(updatedFields).length) {
    await skuSpuStore
      .updateById(store.id, updatedFields)
      .then(() => toast.success(`Cập nhật thành công`), showError)
  }

  dialog.value = false
  clearForm()
}

function showDialog() {
  dialog.value = true
}
</script>

<template>
  <v-dialog v-model="dialog" scrollable max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5">Sửa thông tin SKU-SPU</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form ref="form" v-model="valid" validate-on="blur" @submit.prevent="submit">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.sku"
                  label="SKU *"
                  density="compact"
                  variant="underlined"
                  :rules="[required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.spu"
                  label="SPU *"
                  density="compact"
                  variant="underlined"
                  :rules="[required]"
                ></v-text-field>
              </v-col>
            </v-row>

            <small>* Trường bắt buộc</small>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false"> Thoát </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="submit"> Lưu </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

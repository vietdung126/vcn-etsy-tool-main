<script setup>
import * as xlsx from 'xlsx'
import { ref, onMounted, useTemplateRef } from 'vue'
import { useToast } from 'vue-toastification'
import { storeToRefs } from 'pinia'
import { useStoreStore } from '@/components/Store/store'
import * as service from '../service'

const toast = useToast()
function showError(error) {
  toast.error('LỖI: ' + error.message || error, { duration: 5000 })
}

const storeStore = useStoreStore()
const { allStores: stores } = storeToRefs(storeStore)
const selectedStore = ref()
const selectedFile = ref()
const jsondata = ref([])
const refGrid = useTemplateRef('grid')
const refInput = useTemplateRef('input')

onMounted(() => {
  storeStore.load().catch(showError)
})

function onBtnExcuteClicked() {
  if (!selectedStore.value) {
    toast.warning('Cảnh báo: Bạn chưa chọn Kho', { duration: 5000 })
  } else if (!selectedFile.value) {
    toast.warning('Cảnh báo: Bạn chưa chọn file', { duration: 5000 })
  } else {
    service
      .transform(selectedStore.value, selectedFile.value)
      .then(data => {
        jsondata.value = data
      })
      .catch(showError)
  }
}

function exportAsExcel() {
  // const format = 'xlsx'
  // const exportSelectedOnly = true
  // const filename = 'test'
  // debugger
  // refGrid.value.exportTable(format, exportSelectedOnly, filename)
  // console.log(refInput.value)
  writeExcel(jsondata.value)
}

function writeExcel(items) {
  /* create a new blank workbook */
  const workbook = xlsx.utils.book_new()
  const lines = [
    [
      null,
      'Order number',
      'Tracking code',
      'SKU',
      'Size',
      'SPU',
      'Base cost',
      'Quatity',
      'Total Price',
      'Shipping method',
      'Country code',
      'Customer Name',
      'Province',
      'City',
      'Address 1',
      'Postcode',
      'VAT',
      'Telephone',
      'Email',
      'Design Link',
      'Note',
      'Color',
      'Personalisation',
    ],
  ]

  items.forEach(item => {
    const line = [
      null,
      item.orderNumber,
      item.trackingCode,
      item.sku,
      item.size,
      item.spu,
      item.baseCost,
      item.quantity,
      item.totalPrice,
      item.shippingMethod,
      item.countryCode,
      item.customerName,
      item.province,
      item.city,
      item.address1,
      item.postcode,
      item.vat,
      item.telephone,
      item.email,
      item.designLink,
      item.note,
      item.color,
      item.personalisation,
    ]

    lines.push(line)
  })

  var worksheet = xlsx.utils.aoa_to_sheet(lines)

  // Định dạng background cho hàng đầu tiên
  const range = xlsx.utils.decode_range(worksheet['!ref'])

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell_address = xlsx.utils.encode_cell({ r: 0, c: C })
    if (!worksheet[cell_address]) continue
    worksheet[cell_address].s = {
      fill: {
        patternType: 'solid',
        fgColor: { rgb: 'FFFF00' }, // Màu vàng
      },
    }
  }

  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // write the workbook object to a file
  const excelBuffer = xlsx.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  const data = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  })
  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'orders_' + new Date().toJSON() + '.xlsx')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div>
    <v-row>
      <v-col cols="3">
        <v-autocomplete
          v-model="selectedStore"
          density="compact"
          label="Kho"
          :items="stores"
          item-title="name"
          item-value="code"
        ></v-autocomplete>
      </v-col>
      <v-col cols="5">
        <v-file-input
          v-model="selectedFile"
          density="compact"
          label="File pdf đơn hàng"
          show-size="1024"
          prepend-icon="mdi-file-pdf-box"
        >
        </v-file-input>
      </v-col>
      <v-col cols="4">
        <v-btn style="margin-right: 20px" @click="onBtnExcuteClicked">Phân tích</v-btn>
        <v-btn @click="exportAsExcel">Tải file Excel</v-btn>
      </v-col>
    </v-row>
    <v-input ref="input"></v-input>
    <vue-excel-editor ref="gird" v-model="jsondata" readonly>
      <vue-excel-column field="orderNumber" label="Order number" type="string" width="150px" />
      <vue-excel-column field="trackingCode" label="Tracking code" type="string" />
      <vue-excel-column field="sku" label="SKU" type="string" width="180px" />
      <vue-excel-column field="size" label="Size" type="string" width="60px" />
      <vue-excel-column field="spu" label="SPU" type="string" width="180px" />
      <vue-excel-column field="baseCost" label="Base cost" type="string" />
      <vue-excel-column field="quantity" label="Quantity" type="string" width="80px" />
      <vue-excel-column field="totalPrice" label="Total Price" type="string" />
      <vue-excel-column
        field="shippingMethod"
        label="Shipping method"
        type="string"
        width="180px"
      />
      <vue-excel-column field="countryCode" label="Country code" type="string" width="150px" />
      <vue-excel-column field="customerName" label="Customer Name" type="string" width="180px" />
      <vue-excel-column field="province" label="Province" type="string" width="180px" />
      <vue-excel-column field="city" label="City" type="string" width="180px" />
      <vue-excel-column field="address1" label="Address 1" type="string" width="180px" />
      <vue-excel-column field="postcode" label="Postcode" type="string" />
      <vue-excel-column field="vat" label="VAT" type="string" />
      <vue-excel-column field="telephone" label="Telephone" type="string" />
      <vue-excel-column field="email" label="Email" type="string" />
      <vue-excel-column field="designLink" label="Design Link" type="string" width="280px" />
      <vue-excel-column field="note" label="Note" type="string" width="180px" />
      <vue-excel-column field="color" label="Color" type="string" width="100px" />
      <vue-excel-column
        field="personalisation"
        label="Personalisation"
        type="string"
        width="280px"
      />
    </vue-excel-editor>
  </div>
</template>

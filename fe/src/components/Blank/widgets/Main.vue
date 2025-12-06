<script setup>
const jsondata = [
  { user: 'user', name: 'name', phone: 'phone', gender: 'gender', age: 10, birthday: '1988-06-20' },
]
</script>

<template>
  <vue-excel-editor v-model="jsondata">
    <vue-excel-column field="user" label="User ID" type="string" width="80px" />
    <vue-excel-column field="name" label="Name" type="string" width="150px" />
    <vue-excel-column field="phone" label="Contact" type="string" width="130px" />
    <vue-excel-column
      field="gender"
      label="Gender"
      type="select"
      width="50px"
      :options="['F', 'M', 'U']"
    />
    <vue-excel-column field="age" label="Age" type="number" width="70px" />
    <vue-excel-column field="birth" label="Date Of Birth" type="date" width="80px" />
  </vue-excel-editor>
</template>

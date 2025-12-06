<script setup>
import { ref } from 'vue'
import CreateForm from './CreateForm.vue'
import FolderList from '../../Group/widgets/GroupList.vue'
import SpuListByFolder from './SpuListByGroup.vue'

const selectedGroup = ref()
</script>

<template>
  <v-row>
    <v-col cols="4">
      <v-card>
        <v-card-title class="bg-grey-lighten-4 d-flex align-center">
          <span>Folder</span>
        </v-card-title>
        <v-divider />
        <v-card-item>
          <FolderList @on-selected-group="group => (selectedGroup = group)" type="sku"></FolderList>
        </v-card-item>
      </v-card>
    </v-col>
    <v-col cols="8">
      <v-card>
        <v-card-title class="bg-grey-lighten-4 d-flex align-center">
          <span> Cặp SKU-SPU </span>
          <v-spacer></v-spacer>
          <CreateForm :groupId="selectedGroup?.id" />
        </v-card-title>
        <v-divider />
        <v-card-item>
          <SpuListByFolder :groupId="selectedGroup?.id" :btnCreate="false"></SpuListByFolder>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

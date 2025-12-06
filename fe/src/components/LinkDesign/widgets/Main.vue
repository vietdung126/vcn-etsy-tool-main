<script setup>
import { ref } from 'vue'
import CreateForm from './CreateForm.vue'
import FolderList from '../../Group/widgets/GroupList.vue'
import LinkDesignListByGroup from './LinkDesignListByGroup.vue'

const selectedGroup = ref()
</script>

<template>
  <v-row>
    <v-col cols="4">
      <v-card>
        <v-card-title class="bg-grey-lighten-4 d-flex align-center">
          <span class="text-h5">Folder</span>
        </v-card-title>
        <v-divider />
        <v-card-item>
          <FolderList
            @on-selected-group="group => (selectedGroup = group)"
            type="link"
          ></FolderList>
        </v-card-item>
      </v-card>
    </v-col>
    <v-col cols="8">
      <v-card>
        <v-card-title class="bg-grey-lighten-4 d-flex align-center">
          <span> Cặp SKU-Link Design </span>
          <v-spacer></v-spacer>
          <CreateForm :groupId="selectedGroup?.id" />
        </v-card-title>
        <v-divider />
        <v-card-item>
          <LinkDesignListByGroup
            :groupId="selectedGroup?.id"
            :btnCreate="false"
          ></LinkDesignListByGroup>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

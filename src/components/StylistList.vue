<template>
    <v-list class="rounded-lg">
      <v-list-item
        v-for="provider in providers"
        :key="provider.id"
      >
        <template v-slot:prepend>
          <v-avatar>
            <v-img :src="provider.image" />
          </v-avatar>
        </template>
        <v-list-item-title>{{ provider.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ provider.status }}</v-list-item-subtitle>
        <template v-slot:append>
          <v-switch color="primary" hide-details />
        </template>
      </v-list-item>
    </v-list>
  </template>
  
  <script setup lang="ts">
  import type { Provider } from '@/stores/providers'
  
  defineOptions({ name: 'ProviderList' })
  
  defineProps<{
    providers: Provider[];
  }>();
  </script>
  
  <style scoped>
  .v-list-item {
    border-radius: 12px;
    margin-bottom: 8px;
  }
  </style>

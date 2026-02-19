<template>
  <v-card class="mt-6">
    <v-card-title class="d-flex align-center justify-space-between">
      Existing Services
      <v-chip size="small">{{ services.length }} Total</v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-list lines="two">
      <v-list-item
        v-for="service in services"
        :key="service.id"
        :title="service.name"
        :subtitle="`$${service.price} • ${service.duration} mins • ${service.schedulingMode}`"
      >
        <template #prepend>
          <v-avatar color="primary-lighten-4" size="40">
            <v-icon color="primary">mdi-tag-outline</v-icon>
          </v-avatar>
        </template>
        <template #append>
          <v-btn
            icon="mdi-pencil"
            variant="text"
            size="small"
            color="primary"
            class="mr-1"
            @click="$emit('edit', service)"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            variant="text"
            size="small"
            color="error"
            @click="$emit('delete', service.id)"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import type { Service } from '@/stores/services'

defineProps<{
  services: Service[]
}>()

defineEmits<{
  (e: 'edit', service: Service): void
  (e: 'delete', id: number): void
}>()
</script>

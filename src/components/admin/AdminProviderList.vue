<template>
  <v-card class="mt-6">
    <v-card-title class="d-flex align-center justify-space-between">
      Specialists
      <v-chip size="small">{{ providers.length }} Total</v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-list density="compact">
      <v-list-item v-for="prov in providers" :key="prov.id" :title="prov.name" :subtitle="prov.status">
        <template #prepend>
          <v-avatar size="32" class="mr-2">
            <v-img v-if="prov.image" :src="prov.image" />
            <v-icon v-else color="grey">mdi-account</v-icon>
          </v-avatar>
        </template>
        <template #append>
          <v-btn icon="mdi-pencil" size="x-small" variant="text" color="primary" @click="$emit('edit', prov)" />
          <v-btn icon="mdi-delete" size="x-small" variant="text" color="error" @click="$emit('remove', prov.id)" />
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import type { Provider } from '@/stores/providers'

defineProps<{
  providers: Provider[]
}>()

defineEmits<{
  (e: 'edit', provider: Provider): void
  (e: 'remove', id: number): void
}>()
</script>
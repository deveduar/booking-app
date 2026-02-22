<template>
  <v-card class="mt-6">
    <v-card-title class="d-flex align-center justify-space-between">
      Existing Services
      <v-chip size="small">{{ services.length }} Total</v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-list lines="three">
      <v-list-item
        v-for="service in services"
        :key="service.id"
        :title="service.name"
      >
        <v-list-item-subtitle class="mt-1">
          <div class="d-flex align-center flex-wrap gap-2">
            <v-chip size="x-small" label color="primary" class="mr-2">{{ service.category }}</v-chip>
            <span class="mr-2">${{ service.price }}</span>
            <span class="mr-2">•</span>
            <span class="mr-2">{{ service.duration }} mins</span>
            <span class="mr-2">•</span>
            <span class="text-caption">{{ service.schedulingMode }}</span>
          </div>
          
          <div class="d-flex align-center mt-1 text-caption text-grey-darken-1">
             <v-icon size="x-small" class="mr-1">mdi-account-multiple</v-icon>
             {{ getAssignedProviderNames(service.id) }}
             
             <span class="mx-2">•</span>
             
             <v-icon size="x-small" class="mr-1">mdi-calendar-range</v-icon>
             {{ getAvailabilitySummary(service) }}
             
             <span v-if="getOverridesCount(service) > 0" class="ml-2 text-primary font-weight-medium d-flex align-center">
                <v-icon size="x-small" color="primary" class="mr-1">mdi-account-star</v-icon>
                {{ getOverridesCount(service) }} Overrides
             </span>
          </div>

          <div v-if="service.description" class="text-caption text-grey mt-1 text-truncate">
            {{ service.description }}
          </div>
        </v-list-item-subtitle>

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
import type { Provider } from '@/stores/providers'

const props = defineProps<{
  services: Service[]
  providers?: Provider[]
}>()

defineEmits<{
  (e: 'edit', service: Service): void
  (e: 'delete', id: number): void
}>()

function getAssignedProviderNames(serviceId: number): string {
  if (!props.providers) return '0 Specialists'
  const assigned = props.providers.filter(p => p.serviceIds.includes(serviceId))
  if (assigned.length === 0) return '0 Specialists'
  const names = assigned.map(p => p.name).join(', ')
  return `${assigned.length} Specialists: ${names}`
}

function getOverridesCount(service: Service): number {
  if (!service.providerAvailability) return 0
  return Object.keys(service.providerAvailability).length
}

function getAvailabilitySummary(service: Service): string {
  if (service.schedulingMode === 'Fixed Slots') {
    const slots = service.availableSlots?.length || 0
    return `${slots} Fixed Dates`
  }
  if (service.dateRange?.start) {
    return `${service.dateRange.start} — ${service.dateRange.end || 'Ongoing'}`
  }
  return 'Standard Availability'
}
</script>

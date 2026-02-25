<template>
  <v-card class="mt-6">
    <v-card-title class="d-flex align-center justify-space-between">
      Specialists
      <v-chip size="small">{{ providers.length }} Total</v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-list density="compact" lines="two">
      <v-list-item v-for="prov in providers" :key="prov.id" :subtitle="prov.status">
        <template #title>
          <div class="d-flex align-center">
            {{ prov.name }}
            <v-tooltip v-if="prov.isFeatured" text="Featured Expert">
              <template #activator="{ props }">
                <v-icon v-bind="props" color="amber" size="x-small" class="ml-2">mdi-star</v-icon>
              </template>
            </v-tooltip>
          </div>
        </template>
        <template #prepend>
          <v-avatar size="32" class="mr-2">
            <v-img v-if="prov.image" :src="prov.image" />
            <v-icon v-else color="grey">mdi-account</v-icon>
          </v-avatar>
        </template>
        
        <div class="mt-2" v-if="getAssignedServices(prov).length > 0">
           <v-chip
             v-for="svc in getAssignedServices(prov)" 
             :key="svc.id"
             size="x-small"
             class="mr-1 mb-1"
             variant="outlined"
             color="primary"
           >
             <v-icon v-if="prov.preferredServiceId === svc.id" size="x-small" class="mr-1">mdi-star</v-icon>
             {{ svc.name }}: {{ getServiceSchedule(svc, prov.id) }}
             <span v-if="prov.preferredServiceId === svc.id" class="ml-1 text-uppercase font-weight-bold" style="font-size: 8px;">(Preferred)</span>
           </v-chip>
        </div>
        <div v-else class="text-caption text-grey mt-1">
          No services assigned
        </div>

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
import type { Service } from '@/stores/services'

const props = defineProps<{
  providers: Provider[]
  services?: Service[]
}>()

defineEmits<{
  (e: 'edit', provider: Provider): void
  (e: 'remove', id: number): void
}>()

function getAssignedServices(provider: Provider): Service[] {
  if (!props.services) return []
  return props.services.filter(s => provider.serviceIds.includes(s.id))
}

function getServiceSchedule(service: Service, providerId: number): string {
  // Check override
  if (service.providerAvailability && service.providerAvailability[providerId]) {
     const override = service.providerAvailability[providerId];
     if (override.schedulingMode === 'Fixed Slots' && override.availableSlots?.length) {
        const dates = override.availableSlots.slice(0, 2).map(s => `${s.date} (${s.times.join(',')})`).join('; ')
        return override.availableSlots.length > 2 ? `${dates}...` : dates
     }
     if (override.dateRange?.start) {
        return `${override.dateRange.start} - ${override.dateRange.end || 'Ongoing'}`
     }
  }
  
  // Default
  if (service.schedulingMode === 'Fixed Slots' && service.availableSlots?.length) {
      const dates = service.availableSlots.slice(0, 2).map(s => `${s.date} (${s.times.join(',')})`).join('; ')
      return service.availableSlots.length > 2 ? `${dates}...` : dates
  }
  if (service.dateRange?.start) {
      return `${service.dateRange.start} - ${service.dateRange.end || 'Ongoing'}`
  }
  
  return 'Standard'
}
</script>
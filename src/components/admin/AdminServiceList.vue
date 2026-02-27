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
        :class="{ 'opacity-60': service.isVisible === false }"
      >
        <template #title>
          <div class="d-flex align-center">
            {{ service.name }}
            <v-chip
              v-if="service.isVisible === false"
              size="x-small"
              color="grey"
              variant="flat"
              class="ml-2"
            >
              Hidden
            </v-chip>
            <v-chip
              v-if="service.isFeatured"
              size="x-small"
              color="amber"
              variant="flat"
              class="ml-2"
              prepend-icon="mdi-star"
            >
              Featured
            </v-chip>
          </div>
        </template>
        <v-list-item-subtitle class="mt-1">
          <div class="d-flex align-center flex-wrap">
            <v-chip size="x-small" label color="primary" class="mr-2 mb-1">{{ service.category }}</v-chip>
            <span class="mr-2 mb-1 text-body-2 font-weight-medium">${{ service.price }}</span>
            <span class="mr-2 mb-1">•</span>
            <span class="mr-2 mb-1">{{ service.duration }} mins</span>
            <span class="mr-2 mb-1">•</span>
            <span class="text-caption mb-1">{{ service.schedulingMode }}</span>
          </div>
          
          <div class="d-flex flex-wrap align-center text-caption text-grey-darken-1">
             <div class="d-flex align-center mr-3 mb-1">
                <v-icon size="x-small" class="mr-1">mdi-account-multiple</v-icon>
                {{ getAssignedProviderNames(service.id) }}
             </div>
             
             <div class="d-flex align-center mr-3 mb-1">
                <v-icon size="x-small" class="mr-1">mdi-calendar-range</v-icon>
                {{ getAvailabilitySummary(service) }}
                <span v-if="getAvailabilityDetail(service)" class="text-caption text-grey ml-1">
                  ({{ getAvailabilityDetail(service) }})
                </span>
             </div>
             
             <div v-if="getOverridesCount(service) > 0" class="d-flex align-center text-primary font-weight-medium mb-1">
                <v-icon size="x-small" color="primary" class="mr-1">mdi-account-star</v-icon>
                {{ getOverridesCount(service) }} Overrides
             </div>
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
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-dots-vertical"
                variant="text"
                size="small"
                color="medium-emphasis"
              ></v-btn>
            </template>
            <v-list density="compact">
              <v-list-item 
                prepend-icon="mdi-pencil" 
                title="Edit Details" 
                @click="$emit('edit', service)"
              />
              <v-list-item 
                prepend-icon="mdi-content-copy" 
                title="Duplicate Service" 
                @click="$emit('duplicate', service)"
              />
              <v-divider class="my-1"></v-divider>
              <v-list-item 
                :prepend-icon="service.isFeatured ? 'mdi-star-off-outline' : 'mdi-star-outline'" 
                :title="service.isFeatured ? 'Remove Featured' : 'Mark as Featured'" 
                color="amber-darken-2"
                @click="$emit('toggle-featured', service)"
              />
              <v-list-item 
                :prepend-icon="service.isVisible !== false ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" 
                :title="service.isVisible !== false ? 'Make Private' : 'Make Public'" 
                @click="$emit('toggle-visibility', service)"
              />
              <v-divider class="my-1"></v-divider>
              <v-list-item 
                prepend-icon="mdi-delete" 
                title="Delete Service" 
                color="error"
                @click="$emit('delete', service.id)"
              />
            </v-list>
          </v-menu>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import type { Service } from '@/stores/services'
import type { Provider } from '@/stores/providers'
import { useSettings } from '@/composables/useSettings'

const props = defineProps<{
  services: Service[]
  providers?: Provider[]
}>()

const { formatDate, formatTime } = useSettings()

defineEmits<{
  (e: 'edit', service: Service): void
  (e: 'delete', id: number): void
  (e: 'duplicate', service: Service): void
  (e: 'toggle-featured', service: Service): void
  (e: 'toggle-visibility', service: Service): void
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
    return `${formatDate(service.dateRange.start)} — ${service.dateRange.end ? formatDate(service.dateRange.end) : 'Ongoing'}`
  }
  return 'Standard Availability'
}

function getAvailabilityDetail(service: Service): string {
  if (service.schedulingMode === 'Fixed Slots' && service.availableSlots?.length) {
    // Show first 2 dates as example
    const dates = service.availableSlots.slice(0, 2).map(s => `${formatDate(s.date)} (${s.times.map(t => formatTime(t)).join(', ')})`).join('; ')
    return service.availableSlots.length > 2 ? `${dates}...` : dates
  }
  if (service.schedulingMode === 'Standard' && service.timeRange?.start) {
    return `${formatTime(service.timeRange.start)} - ${formatTime(service.timeRange.end)}`
  }
  return ''
}
</script>

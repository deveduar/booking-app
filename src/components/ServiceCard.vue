<template>
    <v-card class="mx-auto overflow-hidden" max-width="400"  rounded="lg">
      <v-img
        v-if="props.service.thumbnailUrl || props.service.imageUrl"
        :src="props.service.thumbnailUrl || props.service.imageUrl"
        height="180"
        cover
        class="align-end"
      >
        <v-card-title class="text-white bg-surface w-100 text-truncate">
          {{ props.service.name }}
        </v-card-title>
      </v-img>
      <v-sheet
        v-else
        height="180"
        class="d-flex align-center justify-center border-b position-relative"
      >
        <v-icon icon="mdi-image-off-outline" size="48" />
        <v-card-title class=" w-100 position-absolute bottom-0">
          {{ props.service.name }}
        </v-card-title>
      </v-sheet>

      <v-card-subtitle class="mt-2 text-body-2">
        {{ props.service.description }}
      </v-card-subtitle>
      
      <v-card-text>
        <div class="d-flex align-center flex-wrap ga-2 mt-1">
          <v-chip size="small" color="primary" variant="flat">
            <v-icon start icon="mdi-currency-usd" size="x-small" />
            {{ (Number(props.service.price) || 0).toFixed(0) }}
          </v-chip>
          <v-chip size="small" variant="tonal">
            <v-icon start icon="mdi-clock-outline" size="x-small" />
            {{ Number(props.service.duration) || 0 }}m
          </v-chip>
          <v-chip v-if="props.service.isFeatured" size="small" color="amber" variant="tonal">
            <v-icon start icon="mdi-star" size="x-small" />
            Featured
          </v-chip>
        </div>

        <div v-if="props.service.defaultDate" class="mt-4 text-primary font-weight-bold text-caption d-flex align-center">
          <v-icon size="small" color="primary" class="mr-2">mdi-calendar-star</v-icon>
          Next: {{ props.service.defaultDate }} @ {{ props.service.defaultTime }}
        </div>
        
        <div v-if="defaultProvider" class="mt-1 text-medium-emphasis text-caption d-flex align-center">
          <v-icon size="x-small" color="grey" class="mr-2">mdi-account-star-outline</v-icon>
          Expert: {{ defaultProvider.name }}
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-btn 
          block
          color="primary" 
          variant="elevated"
          @click="handleBooking"
          aria-label="Book Appointment"
          rounded="pill"
        >
          Book Appointment
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
<script setup lang="ts">
 import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProvidersStore } from '@/stores/providers'
import type { Service } from '@/stores/services'

defineOptions({ name: 'ServiceCard' })

const props = defineProps<{ service: Service }>()
const router = useRouter()
const providersStore = useProvidersStore()

const defaultProvider = computed(() => {
  if (!props.service.defaultProviderId) return null
  return providersStore.providers.find(p => p.id === props.service.defaultProviderId)
})

const handleBooking = () => {
  router.push({ 
    path: '/booking', 
    query: { 
      serviceId: props.service.id,
      providerId: props.service.defaultProviderId,
      date: props.service.defaultDate,
      time: props.service.defaultTime
    } 
  })
}
</script>

<style scoped>
  .v-card {
    transition: box-shadow 0.3s ease;
  }
  .v-card:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }
  .bg-black-opacity-50 {
    background: rgba(0, 0, 0, 0.5);
  }
  </style>
  

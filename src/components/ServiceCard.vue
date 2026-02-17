<template>
    <v-card class="mx-auto" max-width="400" outlined>
      <v-card-title class="text-h6 font-weight-bold">
        {{ service.name }}
      </v-card-title>
      <v-card-subtitle class="text-body-1">
        {{ service.description }}
      </v-card-subtitle>
      <v-card-text>
        <div class="mb-2">
          <strong>Price:</strong> ${{ (Number(service.price) || 0).toFixed(2) }}
        </div>
        <div class="mb-2">
          <strong>Duration:</strong> {{ Number(service.duration) || 0 }} mins
        </div>
        <div v-if="service.defaultDate" class="mt-2 text-primary font-weight-bold">
          <v-icon size="small" color="primary" class="mr-1">mdi-calendar-star</v-icon>
          Next Event: {{ service.defaultDate }} {{ service.defaultTime }}
        </div>
        <div v-if="defaultProvider" class="mt-1 text-secondary text-caption">
          <v-icon size="x-small" color="secondary" class="mr-1">mdi-account-star</v-icon>
          Recommended: {{ defaultProvider.name }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary" 
          @click="handleBooking"
          aria-label="Book Appointment"
        >
          Book Now
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
<script setup lang="ts">
 import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useProvidersStore } from '@/stores/providers'

type Service = {
  id: number
  name: string
  description: string
  price: number
  duration: number
  category: string
  defaultDate?: string
   defaultTime?: string
  defaultProviderId?: number
  availableSlots?: any[]
}

defineOptions({ name: 'ServiceCard' })

 const { service } = defineProps<{ service: Service }>()
const router = useRouter()
const providersStore = useProvidersStore()

const defaultProvider = computed(() => {
  if (!service.defaultProviderId) return null
  return providersStore.providers.find(p => p.id === service.defaultProviderId)
})

const handleBooking = () => {
  router.push({ 
    path: '/booking', 
    query: { 
      serviceId: service.id,
      providerId: service.defaultProviderId,
      date: service.defaultDate,
      time: service.defaultTime
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
  </style>
  

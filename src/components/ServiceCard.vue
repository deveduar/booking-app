<template>
    <v-card class="mx-auto overflow-hidden" max-width="400" rounded="lg">
      <v-row no-gutters>
        <!-- Media Column -->
        <v-col cols="4" sm="4" md="12" :class="{ 'border-e': !$vuetify.display.mdAndUp }">
          <v-img
            v-if="props.service.thumbnailUrl || props.service.imageUrl"
            :src="props.service.thumbnailUrl || props.service.imageUrl"
            :height="$vuetify.display.mdAndUp ? 180 : '100%'"
            min-height="120"
            cover
            class="align-end"
          >
            <v-card-title v-if="$vuetify.display.mdAndUp" class="text-white bg-surface w-100 text-truncate">
              {{ props.service.name }}
            </v-card-title>
          </v-img>
          <v-sheet
            v-else
            :height="$vuetify.display.mdAndUp ? 180 : '100%'"
            min-height="120"
            class="d-flex align-center justify-center position-relative"
          >
            <v-icon icon="mdi-image-off-outline" size="48" />
            <v-card-title v-if="$vuetify.display.mdAndUp" class="w-100 position-absolute bottom-0">
              {{ props.service.name }}
            </v-card-title>
          </v-sheet>
        </v-col>

        <!-- Content Column -->
        <v-col cols="8" sm="8" md="12">
          <v-card-title v-if="!$vuetify.display.mdAndUp" class="text-h6 font-weight-bold pt-2 px-4 pb-0">
            {{ props.service.name }}
          </v-card-title>
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
              <v-chip v-if="defaultProvider" size="small" variant="outlined" color="secondary">
                <v-icon start icon="mdi-account-star-outline" size="x-small" />
                {{ defaultProvider.name }}
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
        </v-col>
      </v-row>
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
  

<template>
  <v-row class="mb-6">
    <v-col cols="12">
      <v-card color="primary" theme="dark" class="pa-4">
        <div class="d-flex align-center">
          <v-icon size="64" class="mr-4">mdi-shield-crown</v-icon>
          <div>
            <h2 class="text-h4 font-weight-bold">Admin Dashboard</h2>
            <p class="text-subtitle-1">Welcome back, {{ userName }}. Managing the salon today.</p>
          </div>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="4" v-for="stat in stats" :key="stat.title">
      <v-card class="pa-4" elevation="2">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="text-overline mb-1">{{ stat.title }}</div>
            <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
          </div>
          <v-icon :color="stat.color" size="48">{{ stat.icon }}</v-icon>
        </div>
        <v-btn :to="stat.to" variant="text" color="primary" size="small" class="mt-2 px-0">
          Manage {{ stat.title }} <v-icon end size="small">mdi-arrow-right</v-icon>
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useServicesStore } from '@/stores/services'
import { useProvidersStore } from '@/stores/providers'
import { useAppointmentsStore } from '@/stores/appointments'

defineProps<{ userName: string }>()

const servicesStore = useServicesStore()
const providersStore = useProvidersStore()
const appointmentsStore = useAppointmentsStore()

const stats = computed(() => [
  { 
    title: 'Services', 
    value: servicesStore.services.length, 
    icon: 'mdi-clipboard-list', 
    color: 'blue',
    to: '/admin'
  },
  { 
    title: 'Specialists', 
    value: providersStore.providers.length, 
    icon: 'mdi-account-group', 
    color: 'green',
    to: '/admin'
  },
  { 
    title: 'Appointments', 
    value: appointmentsStore.appointments.length, 
    icon: 'mdi-calendar-clock', 
    color: 'orange',
    to: '/admin'
  }
])
</script>

<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Next Appointment</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" v-if="next">
        <v-card>
          <v-card-title>{{ next.service }}</v-card-title>
          <v-card-subtitle>{{ next.date }} at {{ next.time }}</v-card-subtitle>
          <v-card-text>
            <div v-if="next.provider">Provider: {{ next.provider }}</div>
            <div>Status: {{ next.status }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" to="/history">View History</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" v-else>
        <v-alert type="info" variant="tonal">No upcoming appointments.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '@/stores/appointments'

const appointmentsStore = useAppointmentsStore()
const { upcoming } = storeToRefs(appointmentsStore)

const next = computed(() => upcoming.value[0] ?? null)
</script>


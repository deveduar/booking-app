<template>
  <v-row class="mb-6">
    <v-col cols="12">
      <v-card variant="outlined" color="primary" class="pa-6 border-dashed">
        <v-row align="center">
          <v-col cols="12" md="8">
            <h2 class="text-h4 font-weight-bold mb-2">Hello, {{ userName }}!</h2>
            <p class="text-body-1 mb-4" v-if="nextAppointment">
              You have an upcoming appointment for <strong>{{ nextAppointment.service }}</strong> 
              on <strong>{{ nextAppointment.date }}</strong> at <strong>{{ nextAppointment.time }}</strong>.
            </p>
            <p class="text-body-1 mb-4" v-else>
              Ready for your next salon visit? Book a specialist today.
            </p>
            <v-btn to="/booking" color="primary" size="large" prepend-icon="mdi-calendar-plus">
              Book New Appointment
            </v-btn>
          </v-col>
          <v-col cols="12" md="4" class="text-center d-none d-md-block">
            <v-icon size="120" color="primary" class="opacity-20">mdi-sparkles</v-icon>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'

const props = defineProps<{ userName: string }>()

const appointmentsStore = useAppointmentsStore()

const nextAppointment = computed(() => {
  return appointmentsStore.appointments
    .filter(a => a.userName === props.userName && a.status === 'Upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
})
</script>

<style scoped>
.border-dashed {
  border-style: dashed !important;
  border-width: 2px !important;
}
</style>

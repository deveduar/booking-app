<template>
    <v-container class="py-5">
      <!-- Page Title -->
      <v-row>
        <v-col>
          <h1 class=" display-2 font-weight-bold text-h4  mb-4">Appointment History</h1>
        </v-col>
      </v-row>
  
      <!-- Filter and Sort Options -->
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="filter"
            :items="filterOptions"
            label="Filter by"
            dense
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Sort by"
            dense
          ></v-select>
        </v-col>
      </v-row>
  
      <!-- Appointment List -->
      <v-row>
        <v-col cols="12" v-if="filteredAppointments.length">
          <v-card
            v-for="appointment in filteredAppointments"
            :key="appointment.id"
            class="mb-3"
          >
            <v-card-title>
              <v-row class="align-center">
                <v-col cols="12" md="6">
                  <div>
                    <strong>{{ appointment.date }}</strong> at
                    <strong>{{ appointment.time }}</strong>
                  </div>
                  <div>Service: {{ appointment.service }}</div>
                  <div v-if="appointment.provider">Provider: {{ appointment.provider }}</div>
                  <div>Status: <strong>{{ appointment.status }}</strong></div>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="d-flex justify-end"
                  v-if="appointment.status === 'Upcoming'"
                >
                  <v-btn color="primary" class="mr-2" @click="reschedule(appointment)">
                    Reschedule
                  </v-btn>
                  <v-btn color="error" @click="cancel(appointment)">Cancel</v-btn>
                </v-col>
              </v-row>
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols="12" v-else>
          <div class="text-center">
            <p>You have no appointments yet. Book one now!</p>
            <v-btn color="primary" to="/booking">Book Appointment</v-btn>
          </div>
        </v-col>
      </v-row>
  
      <!-- Cancel Confirmation Dialog -->
      <v-dialog v-model="cancelDialog" max-width="400px">
        <v-card>
          <v-card-title class="text-h6">Cancel Appointment</v-card-title>
          <v-card-text>Are you sure you want to cancel this appointment?</v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="secondary" @click="cancelDialog = false">Close</v-btn>
            <v-btn color="error" @click="confirmCancel">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAppointmentsStore } from '@/stores/appointments';
  import type { Appointment } from '@/stores/appointments';
  
  const appointmentsStore = useAppointmentsStore();
  const { appointments } = storeToRefs(appointmentsStore);
  
  // Filter and sort options
  const filterOptions = ['All', 'Past Appointments', 'Upcoming Appointments'];
  const sortOptions = ['Date', 'Service'];
  
  // State for filter, sorting, and dialogs
  const filter = ref('All');
  const sortBy = ref('Date');
  const cancelDialog = ref(false);
  const selectedAppointment = ref<Appointment | null>(null); // Ahora tiene el tipo correcto
  
  // Computed appointments based on filter and sort
  const filteredAppointments = computed(() => {
    let filtered = [...appointments.value];
    if (filter.value === 'Past Appointments') {
      filtered = filtered.filter(a => a.status !== 'Upcoming');
    } else if (filter.value === 'Upcoming Appointments') {
      filtered = filtered.filter(a => a.status === 'Upcoming');
    }
    if (sortBy.value === 'Date') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy.value === 'Service') {
      filtered.sort((a, b) => a.service.localeCompare(b.service));
    }
    return filtered;
  });
  
  // Métodos para acciones
  function reschedule(appointment: Appointment) {
    // Redirigir a la página de reprogramación
    console.log(`Redirecting to reschedule appointment: ${appointment.id}`);
  }
  
  function cancel(appointment: Appointment) {
    selectedAppointment.value = appointment;
    cancelDialog.value = true;
  }
  
  function confirmCancel() {
    if (selectedAppointment.value) {
      appointmentsStore.cancelAppointment(selectedAppointment.value.id);
      cancelDialog.value = false;
      selectedAppointment.value = null;
    }
  }
  </script>
  
  
  <style scoped>
  .text-center {
    text-align: center;
  }
  </style>
  

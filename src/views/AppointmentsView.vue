<template>
  <v-container class="py-6">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">My Appointments</h1>
      </v-col>
    </v-row>

    <!-- Next Appointment Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Next Appointment</h2>
        <v-card v-if="next" border elevation="2">
          <v-card-item>
            <template v-slot:prepend>
              <v-icon color="primary" size="x-large">mdi-calendar-check</v-icon>
            </template>
            <v-card-title class="text-h6 pb-0">{{ next.service }}</v-card-title>
            <v-card-subtitle>{{ next.date }} at {{ next.time }}</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <div class="d-flex align-center mb-1">
              <v-icon size="small" class="mr-2">mdi-account</v-icon>
              <span>Provider: {{ next.provider || 'Not assigned' }}</span>
            </div>
            <div class="d-flex align-center">
              <v-chip size="small" color="primary" variant="tonal">{{ next.status }}</v-chip>
            </div>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" @click="cancel(next)">Cancel</v-btn>
          </v-card-actions>
        </v-card>
        <v-alert v-else type="info" variant="tonal" border="start">
          No upcoming appointments scheduled.
          <v-btn color="primary" to="/booking" class="ml-4" size="small">Book Now</v-btn>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Upcoming Appointments (Remaining) -->
    <v-row v-if="otherUpcoming.length" class="mb-8">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold mb-4">Other Upcoming Appointments</h2>
        <v-card v-for="item in otherUpcoming" :key="item.id" border class="mb-3">
          <v-card-item>
            <template v-slot:prepend>
              <v-icon color="secondary" size="large">mdi-calendar-clock</v-icon>
            </template>
            <v-card-title class="text-h6 pb-0">{{ item.service }}</v-card-title>
            <v-card-subtitle>{{ item.date }} at {{ item.time }}</v-card-subtitle>
            <template v-slot:append>
              <v-btn color="error" variant="text" size="small" @click="cancel(item)">Cancel</v-btn>
            </template>
          </v-card-item>
          <v-card-text class="pt-0">
            <div class="d-flex align-center">
               <v-icon size="x-small" class="mr-1">mdi-account</v-icon>
               <span class="text-caption">Provider: {{ item.provider || 'Not assigned' }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="mb-8"></v-divider>

    <!-- History Section -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5 font-weight-bold">Appointment History</h2>
          <div class="d-flex gap-2">
            <v-select
              v-model="sortBy"
              :items="['Date', 'Service']"
              label="Sort by"
              density="compact"
              variant="outlined"
              hide-details
              style="width: 150px"
            ></v-select>
          </div>
        </div>

        <v-card v-if="history.length" border>
          <v-list lines="two">
            <template v-for="(item, index) in sortedHistory" :key="item.id">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar color="surface-variant" rounded>
                    <v-icon>mdi-history</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">{{ item.service }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.date }} · {{ item.time }}
                  <span v-if="item.provider">· {{ item.provider }}</span>
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip size="x-small" :color="getStatusColor(item.status)" variant="tonal">
                    {{ item.status }}
                  </v-chip>
                </template>
              </v-list-item>
              <v-divider v-if="index < sortedHistory.length - 1" inset></v-divider>
            </template>
          </v-list>
        </v-card>
        <div v-else class="text-center py-8 text-grey">
          <v-icon size="64" class="mb-4">mdi-calendar-blank</v-icon>
          <p>No past appointments found.</p>
        </div>
      </v-col>
    </v-row>

    <!-- Cancel Dialog -->
    <v-dialog v-model="cancelDialog" max-width="400px">
      <v-card>
        <v-card-title>Cancel Appointment</v-card-title>
        <v-card-text>Are you sure you want to cancel your {{ selectedAppointment?.service }} on {{ selectedAppointment?.date }}?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="cancelDialog = false">No, Keep it</v-btn>
          <v-btn color="error" @click="confirmCancel">Yes, Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '@/stores/appointments'
import type { Appointment } from '@/stores/appointments'

const appointmentsStore = useAppointmentsStore()
const { appointments, upcoming } = storeToRefs(appointmentsStore)

const sortBy = ref('Date')
const cancelDialog = ref(false)
const selectedAppointment = ref<Appointment | null>(null)

const next = computed(() => upcoming.value[0] || null)
const otherUpcoming = computed(() => upcoming.value.slice(1))
const history = computed(() => appointments.value.filter(a => a.status !== 'Upcoming'))

const sortedHistory = computed(() => {
  const list = [...history.value]
  if (sortBy.value === 'Date') {
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } else {
    list.sort((a, b) => a.service.localeCompare(b.service))
  }
  return list
})

function getStatusColor(status: string) {
  switch (status) {
    case 'Completed': return 'success'
    case 'Canceled': return 'error'
    default: return 'grey'
  }
}

function cancel(app: Appointment) {
  selectedAppointment.value = app
  cancelDialog.value = true
}

function confirmCancel() {
  if (selectedAppointment.value) {
    appointmentsStore.cancelAppointment(selectedAppointment.value.id)
    cancelDialog.value = false
    selectedAppointment.value = null
  }
}
</script>

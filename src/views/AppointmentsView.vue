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
        <v-card v-if="next" border elevation="2" class="overflow-hidden" rounded="lg">
          <v-row no-gutters>
            <!-- Media column -->
            <v-col cols="12" sm="4" md="3">
              <v-img v-if="getServiceThumbnail(next)" :src="getServiceThumbnail(next)" cover height="100%" min-height="120" />
              <v-sheet v-else height="100%" min-height="120" class="d-flex align-center justify-center bg-grey-lighten-4">
                <v-icon icon="mdi-calendar-check" size="40" color="grey-lighten-1" />
              </v-sheet>
            </v-col>
            
            <!-- Content column -->
            <v-col cols="12" sm="8" md="9">
              <v-card-title class="text-h6 font-weight-bold pt-4 px-4">{{ next.service }}</v-card-title>
              <v-card-subtitle class="px-4 pb-2">{{ displayDate(next.date) }} at {{ displayTime(next.time) }}</v-card-subtitle>
              
              <v-card-text class="px-4 py-2">
                <div class="d-flex align-center mb-1" v-if="isAdmin">
                  <v-icon size="small" color="primary" class="mr-2">mdi-account-circle</v-icon>
                  <span class="text-caption">Client: <span class="font-weight-bold">{{ next.userName }}</span></span>
                </div>
                <div class="d-flex align-center mb-1">
                  <v-icon size="small" color="primary" class="mr-2">mdi-account</v-icon>
                  <span class="text-caption">Provider: <span class="font-weight-bold">{{ next.provider || 'Not assigned' }}</span></span>
                </div>
                <div class="d-flex align-center mb-2" v-if="next.createdAt">
                  <v-icon size="small" color="grey" class="mr-2">mdi-clock-outline</v-icon>
                  <span class="text-caption text-medium-emphasis">Booked: {{ displayDateTime(next.createdAt) }}</span>
                </div>
                
                <div class="d-flex align-center justify-space-between">
                  <v-chip size="small" color="primary" variant="flat">{{ next.status }}</v-chip>
                  <v-btn color="error" variant="tonal" size="small" @click="cancel(next)">Cancel</v-btn>
                </div>
              </v-card-text>
            </v-col>
          </v-row>
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
        <v-card v-for="item in otherUpcoming" :key="item.id" border class="mb-3 overflow-hidden" rounded="lg">
          <v-row no-gutters>
            <!-- Media col -->
            <v-col cols="12" sm="4" md="2">
               <v-img v-if="getServiceThumbnail(item)" :src="getServiceThumbnail(item)" cover height="100%" min-height="100" />
               <v-sheet v-else height="100%" min-height="100" class="d-flex align-center justify-center bg-grey-lighten-4">
                 <v-icon icon="mdi-calendar-clock" size="32" color="grey-lighten-1" />
               </v-sheet>
            </v-col>
            
            <!-- Content col -->
            <v-col cols="12" sm="8" md="10">
              <div class="pa-3">
                <div class="d-flex align-center justify-space-between mb-1">
                  <div class="text-subtitle-1 font-weight-bold">{{ item.service }}</div>
                  <v-btn color="error" variant="text" size="small" density="compact" @click="cancel(item)">Cancel</v-btn>
                </div>
                <div class="text-caption mb-2">{{ displayDate(item.date) }} at {{ displayTime(item.time) }}</div>
                
                <div class="d-flex align-center flex-wrap ga-3">
                  <div class="d-flex align-center" v-if="isAdmin">
                    <v-icon size="x-small" color="primary" class="mr-1">mdi-account-circle</v-icon>
                    <span class="text-caption">Client: {{ item.userName }}</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon size="x-small" color="primary" class="mr-1">mdi-account</v-icon>
                    <span class="text-caption">Provider: {{ item.provider || 'Not assigned' }}</span>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
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
              <v-list-item class="pa-0 mb-2" rounded="lg">
                <v-row no-gutters align="center">
                  <!-- Media Col -->
                  <v-col cols="auto" class="pa-2">
                    <v-avatar size="64" rounded="lg" color="surface-variant">
                      <v-img v-if="getServiceThumbnail(item)" :src="getServiceThumbnail(item)" cover />
                      <v-icon v-else>mdi-history</v-icon>
                    </v-avatar>
                  </v-col>
                  
                  <!-- Info Col -->
                  <v-col class="pa-2">
                    <div class="text-subtitle-1 font-weight-bold">{{ item.service }}</div>
                    <div class="text-caption text-medium-emphasis">
                      {{ displayDate(item.date) }} · {{ displayTime(item.time) }}
                      <span v-if="item.provider">· {{ item.provider }}</span>
                    </div>
                  </v-col>
                  
                  <!-- Status Col -->
                  <v-col cols="auto" class="px-4 text-right">
                    <v-chip size="x-small" :color="getStatusColor(item.status)" variant="tonal" class="font-weight-bold">
                      {{ item.status.toUpperCase() }}
                    </v-chip>
                  </v-col>
                </v-row>
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
        <v-card-text>Are you sure you want to cancel your {{ selectedAppointment?.service }} on {{ selectedAppointment ? displayDate(selectedAppointment.date) : '' }}?</v-card-text>
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
import { useServicesStore } from '@/stores/services'
import { useSettings } from '@/composables/useSettings'
import { useAuthStore } from '@/stores/auth'

const appointmentsStore = useAppointmentsStore()
const servicesStore = useServicesStore()
const authStore = useAuthStore()
const { user, isAdmin } = storeToRefs(authStore)

const { appointments } = storeToRefs(appointmentsStore)
const { formatDate, formatTime } = useSettings()

const sortBy = ref('Date')
const cancelDialog = ref(false)
const selectedAppointment = ref<Appointment | null>(null)

/** Display stored HH:mm or h:mm AM/PM time as a user-friendly AM/PM string. */
function displayTime(t: string): string {
  return formatTime(t);
}

function displayDate(d: string): string {
  return formatDate(d);
}

function displayDateTime(isoStr: string): string {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const datePart = `${y}-${m}-${d}`;
  const timePart = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return `${formatDate(datePart)} at ${formatTime(timePart)}`;
}

function getServiceThumbnail(app: Appointment): string | undefined {
  let service = null;
  if (app.serviceId) {
    service = servicesStore.getById(app.serviceId);
  } else {
    // Fallback for older appointments: look up by name
    service = servicesStore.services.find(s => s.name === app.service);
  }
  return service?.thumbnailUrl || service?.imageUrl;
}

// Role-based filtering
const filteredAppointments = computed(() => {
  if (isAdmin.value) return appointments.value
  return appointments.value.filter(a => a.userName === user.value?.name)
})

const upcoming = computed(() => 
  filteredAppointments.value.filter(a => a.status === 'Upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
)

const next = computed(() => upcoming.value[0] || null)
const otherUpcoming = computed(() => upcoming.value.slice(1))
const history = computed(() => filteredAppointments.value.filter(a => a.status !== 'Upcoming'))

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

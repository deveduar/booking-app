<template>
        <v-container class="">
          <!-- Título y descripción -->
          <v-row class="">
            <v-col cols="12">
              <h1 class="text-h4 font-weight-bold">Book an Appointment</h1>
              <p class="text-subtitle-1">Select a date and time for your appointment</p>
            </v-col>
          </v-row>
  
          <!-- Selectores de servicio, proveedor, fecha y hora -->
          <v-form ref="bookingForm">
          <v-row class="mt-3">
            <v-col cols="12" md="6">
              <!-- Service selection remains as a dropdown for space efficiency -->
              <v-select
                v-model="selectedServiceId"
                :items="serviceItems"
                item-title="name"
                item-value="id"
                label="Select a service"
                variant="outlined"
                bg-color="surface"
                color="primary"
                :rules="[v => !!v || 'Service is required']"
              />
            </v-col>
          </v-row>
          
          <!-- Visual Provider Selection -->
          <v-row v-if="selectedServiceId" class="mt-4">
            <v-col cols="12">
              <div class="text-h6 font-weight-bold mb-3">Choose a Specialist</div>
              <v-item-group v-model="selectedProviderId" mandatory>
                <v-row dense>
                  <v-col v-for="provider in providerItems" :key="provider.id" cols="6" sm="4" md="3">
                    <v-item v-slot="{ isSelected, toggle }" :value="provider.id">
                      <v-card
                        :color="isSelected ? 'primary' : 'surface'"
                        class="d-flex flex-column align-center pa-4 cursor-pointer"
                        variant="outlined"
                        @click="toggle"
                      >
                        <v-avatar size="80" class="mb-2">
                          <v-img :src="provider.image" />
                        </v-avatar>
                        <div class="text-subtitle-1 font-weight-medium">{{ provider.name }}</div>
                        <div class="text-caption opacity-70">{{ provider.status }}</div>
                        <v-icon v-if="isSelected" icon="mdi-check-circle" color="white" class="mt-1" />
                      </v-card>
                    </v-item>
                  </v-col>
                </v-row>
              </v-item-group>
              <div v-if="providerItems.length === 0" class="text-error mt-2">
                No specialists available for this service.
              </div>
            </v-col>
          </v-row>
          <v-alert
            v-if="isSpecialistOverride"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-4"
            icon="mdi-account-clock-outline"
            border="start"
          >
            <div class="d-flex flex-column">
              <strong>Unique Specialist Schedule</strong>
              <span class="text-caption">This specialist has defined their own availability for this service, which may differ from the general business hours.</span>
            </div>
          </v-alert>

          <!-- Service Details Section -->
          <v-expand-transition>
            <v-card v-if="selectedService" class="mb-6" variant="tonal" color="secondary" rounded="lg">
              <v-card-text>
                <v-row dense align="center">
                  <v-col cols="12" sm="4" class="d-flex align-center">
                    <v-icon icon="mdi-tag-outline" size="small" class="mr-2" />
                    <div>
                      <div class="text-caption opacity-70">Category</div>
                      <div class="text-body-2 font-weight-bold">{{ selectedService.category }}</div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4" class="d-flex align-center">
                    <v-icon icon="mdi-clock-outline" size="small" class="mr-2" />
                    <div>
                      <div class="text-caption opacity-70">Duration</div>
                      <div class="text-body-2 font-weight-bold">{{ selectedService.duration }} mins</div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4" class="d-flex align-center">
                    <v-icon :icon="activeAvailability?.schedulingMode === 'Fixed Slots' ? 'mdi-calendar-check' : 'mdi-calendar-range'" size="small" class="mr-2" />
                    <div>
                      <div class="text-caption opacity-70">Availability Mode</div>
                      <div class="text-body-2 font-weight-bold">
                        {{ activeAvailability?.schedulingMode === 'Fixed Slots' ? 'Specific Slots Only' : 'Flexible Range' }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-expand-transition>

          <DateTimePicker
            :date="selectedDate"
            :time="selectedTime"
            :available-slots="activeAvailability?.availableSlots"
            :date-range="activeAvailability?.dateRange"
            :time-range="activeAvailability?.timeRange"
            :duration="selectedService?.duration"
            :scheduling-mode="activeAvailability?.schedulingMode"
            @update:date="selectedDate = $event"
            @update:time="selectedTime = $event"
          />
  
  
          <!-- Botón de confirmación -->
          <v-row class="mt-5">
            <v-col cols="12">
              <v-btn block color="primary" size="large" :disabled="!canSubmit" @click="confirm">
                Confirm
              </v-btn>
            </v-col>
          </v-row>
          </v-form>
        </v-container>

        <v-snackbar
          v-model="snackbar"
          :timeout="3000"
          color="success"
          elevation="24"
        >
          {{ snackbarText }}
          <template #actions>
            <v-btn variant="text" @click="snackbar = false">Close</v-btn>
          </template>
        </v-snackbar>
  </template>
  
  <script setup lang="ts">
// import StylistList from '../components/StylistList.vue';
import DateTimePicker from '../components/DateTimePicker.vue';
import { useBooking } from '@/composables/useBooking';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
// const router = useRouter();

const {
  selectedServiceId,
  selectedProviderId,
  selectedDate,
  selectedTime,
  serviceItems,
  providerItems,
  selectedService,
  activeAvailability,
  isSpecialistOverride,
  canSubmit,
  createAppointment
} = useBooking();

const snackbar = ref(false);
const snackbarText = ref('');

// Define minimal VForm interface to avoid 'any'
type VForm = {
  validate: () => Promise<{ valid: boolean }>
};
const bookingForm = ref<VForm | null>(null);

onMounted(() => {
  const serviceIdQuery = route.query.serviceId;
  const providerIdQuery = route.query.providerId;
  const dateQuery = route.query.date;
  const timeQuery = route.query.time;

  // Apply query params with priority
  if (serviceIdQuery) {
    selectedServiceId.value = Number(serviceIdQuery);
  }
  if (providerIdQuery) {
    selectedProviderId.value = Number(providerIdQuery);
  }
  if (dateQuery) {
    selectedDate.value = String(dateQuery);
  }
  if (timeQuery) {
    selectedTime.value = String(timeQuery);
  }
});

async function confirm() {
  if (!bookingForm.value) return;
  
  const { valid } = await bookingForm.value.validate();
  if (!valid) return;

  if (!selectedDate.value || !selectedTime.value) {
    snackbarText.value = 'Please select a date and time';
    snackbar.value = true;
    return;
  }

  const success = createAppointment();
  
  if (success) {
    snackbarText.value = 'Appointment confirmed successfully!';
    snackbar.value = true;
    // Optional: Redirect after delay or let user see snackbar
    // setTimeout(() => {
    //    router.push('/history');
    // }, 1500);
  }
}
</script>

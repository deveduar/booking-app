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
  import StylistList from '../components/StylistList.vue';
  import DateTimePicker from '../components/DateTimePicker.vue';
  import { storeToRefs } from 'pinia';
  import { useProvidersStore } from '@/stores/providers';
  import { useServicesStore } from '@/stores/services';
  import { useAppointmentsStore } from '@/stores/appointments';
   import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { parseTimeMin, formatTimeMin } from '@/utils/timeUtils';
  
  const providersStore = useProvidersStore();
  const { providers } = storeToRefs(providersStore);
  
  const servicesStore = useServicesStore();
  const { services } = storeToRefs(servicesStore);
  
  const appointmentsStore = useAppointmentsStore();
   const route = useRoute();
  const router = useRouter();

  const snackbar = ref(false);
  const snackbarText = ref('');
  
  const bookingForm = ref<any>(null);
  const selectedServiceId = ref<number | null>(null);
  const selectedProviderId = ref<number | null>(null);
  const selectedDate = ref<string | null>(null);
  const selectedTime = ref<string | null>(null);
  
  const serviceItems = computed(() => services.value);
  const providerItems = computed(() => {
    if (!selectedServiceId.value) return providers.value;
    return providersStore.getByService(selectedServiceId.value);
  });
  
  const selectedService = computed(() => services.value.find(s => s.id === selectedServiceId.value));

  const activeAvailability = computed(() => {
    if (!selectedService.value) return null;
    const service = selectedService.value;
    const providerId = selectedProviderId.value;
    
    // Check for provider override
    if (providerId && service.providerAvailability && service.providerAvailability[providerId]) {
      const ov = service.providerAvailability[providerId];
      return {
        ...ov,
        schedulingMode: ov.schedulingMode || service.schedulingMode
      };
    }
    
    // Fallback to service defaults based on mode
    return {
      schedulingMode: service.schedulingMode,
      availableSlots: service.schedulingMode === 'Fixed Slots' ? service.availableSlots : [],
      dateRange: service.schedulingMode === 'Standard' ? service.dateRange : undefined,
      timeRange: service.schedulingMode === 'Standard' ? service.timeRange : undefined
    };
  });

  const isSpecialistOverride = computed(() => {
    if (!selectedService.value || !selectedProviderId.value) return false;
    return !!(selectedService.value.providerAvailability?.[selectedProviderId.value]);
  });
  
  const canSubmit = computed(() => !!(selectedServiceId.value && selectedProviderId.value && selectedDate.value && selectedTime.value));
  
  // Watch for availability changes to Auto-Select earliest
  watch(() => activeAvailability.value, (avail) => {
    if (!avail) return;

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const currentTimeMin = now.getHours() * 60 + now.getMinutes();

    let earliestDate: string | null = null;
    let earliestTime: string | null = null;

    if (avail.availableSlots && avail.availableSlots.length > 0) {
      // Find earliest date >= today that has at least one future time
      const sortedSlots = [...avail.availableSlots].sort((a, b) => a.date.localeCompare(b.date));
      const validSlot = sortedSlots.find(s => {
        if (s.date < todayStr) return false;
        if (s.date === todayStr) return s.times.some(t => parseTimeMin(t) > currentTimeMin);
        return true;
      });

      if (validSlot) {
        earliestDate = validSlot.date;
        if (validSlot.date === todayStr) {
          earliestTime = validSlot.times.find(t => parseTimeMin(t) > currentTimeMin) || null;
        } else {
          earliestTime = validSlot.times[0];
        }
      }
    } else if (avail.dateRange?.start) {
      // Range based
      const rangeStart = avail.dateRange.start;
      const rangeEnd = avail.dateRange.end;

      let potentialDate: string | null = rangeStart >= todayStr ? rangeStart : todayStr;

      // Only skip today if the ENTIRE time window has already passed
      if (potentialDate === todayStr && avail.timeRange?.end) {
        const endMin = parseTimeMin(avail.timeRange.end);
        if (currentTimeMin >= endMin) {
          // The window is truly exhausted — advance to tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(now.getDate() + 1);
          const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

          potentialDate = tomorrowStr;
          // Check if tomorrow is still within the service's date range
          if (rangeEnd && potentialDate > rangeEnd) {
            potentialDate = null;
          }
        }
      }

      earliestDate = potentialDate;

      if (earliestDate && avail.timeRange?.start) {
        const startMin = parseTimeMin(avail.timeRange.start);
        // If today and the start time has already passed, let the DateTimePicker
        // find the first valid future slot automatically (leave earliestTime = null)
        if (earliestDate === todayStr && startMin <= currentTimeMin) {
          earliestTime = null;
        } else {
          // Use formatTimeMin to guarantee the format matches what allowedTimesForDate generates
          earliestTime = formatTimeMin(startMin);
        }
      }
    }

    // Always reset if current selection is invalid or we just switched service/provider
    selectedDate.value = earliestDate;
    selectedTime.value = earliestTime;
  }, { deep: true });

  // Watch for service changes to Reset or auto-select provider
  watch(selectedServiceId, (newId, oldId) => {
    if (newId && newId !== oldId) {
      const availableProviders = providersStore.getByService(newId);
      
      // If current provider is NOT valid for this service, reset it
      if (selectedProviderId.value && !availableProviders.find(p => p.id === selectedProviderId.value)) {
        selectedProviderId.value = null;
      }

      // If only one provider available and none selected, auto-select
      if (availableProviders.length === 1 && !selectedProviderId.value) {
        setTimeout(() => {
           selectedProviderId.value = availableProviders[0].id;
        }, 50);
      }
    }
  });

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
    const { valid } = await bookingForm.value.validate();
    if (!valid) return;

    if (!selectedDate.value || !selectedTime.value) {
      snackbarText.value = 'Please select a date and time';
      snackbar.value = true;
      return;
    }

    const service = servicesStore.getById(selectedServiceId.value as number);
    const provider = providers.value.find(p => p.id === selectedProviderId.value);
    if (!service || !provider || !selectedDate.value || !selectedTime.value) return;
     appointmentsStore.addAppointment({
      date: selectedDate.value,
      time: selectedTime.value,
      service: service.name,
      provider: provider.name,
      status: 'Upcoming',
    });

    snackbarText.value = 'Appointment confirmed successfully!';
    snackbar.value = true;
  }
  </script>

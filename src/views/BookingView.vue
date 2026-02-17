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
          <v-row class="mt-3">
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedServiceId"
                :items="serviceItems"
                item-title="name"
                item-value="id"
                label="Select a service"
                variant="outlined"
                bg-color="surface"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedProviderId"
                :items="providerItems"
                item-title="name"
                item-value="id"
                label="Select a provider"
                variant="outlined"
                bg-color="surface"
                color="primary"
                hide-details
              />
            </v-col>
          </v-row>
          <DateTimePicker
            :date="selectedDate"
            :time="selectedTime"
            :available-slots="selectedService?.availableSlots"
            @update:date="selectedDate = $event"
            @update:time="selectedTime = $event"
          />
  
          <!-- Lista de proveedores -->
          <v-row class="mt-5">
            <v-col cols="12">
              <h2 class="text-h6 font-weight-bold">Provider</h2>
              <StylistList :providers="providers" />
            </v-col>
          </v-row>
  
          <!-- Botón de confirmación -->
          <v-row class="mt-5">
            <v-col cols="12">
              <v-btn block color="primary" size="large" :disabled="!canSubmit" @click="confirm">
                Confirm
              </v-btn>
            </v-col>
          </v-row>
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
  
  const providersStore = useProvidersStore();
  const { providers } = storeToRefs(providersStore);
  
  const servicesStore = useServicesStore();
  const { services } = storeToRefs(servicesStore);
  
  const appointmentsStore = useAppointmentsStore();
   const route = useRoute();
  const router = useRouter();

  const snackbar = ref(false);
  const snackbarText = ref('');
  
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
  
  const canSubmit = computed(() => !!(selectedServiceId.value && selectedProviderId.value && selectedDate.value && selectedTime.value));
  
  // Watch for service changes to Reset or auto-select provider
  watch(selectedServiceId, (newId, oldId) => {
    if (newId && newId !== oldId) {
      const service = servicesStore.getById(newId);
      const availableProviders = providersStore.getByService(newId);
      
      // Apply defaults from service only if not already set by manual selection
      if (service) {
        if (service.defaultDate && (!selectedDate.value || oldId === null)) selectedDate.value = service.defaultDate;
        if (service.defaultTime && (!selectedTime.value || oldId === null)) selectedTime.value = service.defaultTime;
        if (service.defaultProviderId && (!selectedProviderId.value || oldId === null)) {
            selectedProviderId.value = service.defaultProviderId;
        }
      }

      // If current provider is NOT valid for this service, reset it
      // UNLESS we just set it from default or query
      if (selectedProviderId.value && !availableProviders.find(p => p.id === selectedProviderId.value)) {
        selectedProviderId.value = null;
      }

      // If only one provider available and none selected, auto-select
      if (availableProviders.length === 1 && !selectedProviderId.value) {
        selectedProviderId.value = availableProviders[0].id;
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

  function confirm() {
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

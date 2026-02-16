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
  </template>
  
  <script setup lang="ts">
  import StylistList from '../components/StylistList.vue';
  import DateTimePicker from '../components/DateTimePicker.vue';
  import { storeToRefs } from 'pinia';
  import { useProvidersStore } from '@/stores/providers';
  import { useServicesStore } from '@/stores/services';
  import { useAppointmentsStore } from '@/stores/appointments';
  import { ref, computed } from 'vue';
  
  const providersStore = useProvidersStore();
  const { providers } = storeToRefs(providersStore);
  
  const servicesStore = useServicesStore();
  const { services } = storeToRefs(servicesStore);
  
  const appointmentsStore = useAppointmentsStore();
  
  const selectedServiceId = ref<number | null>(null);
  const selectedProviderId = ref<number | null>(null);
  const selectedDate = ref<string | null>(null);
  const selectedTime = ref<string | null>(null);
  
  const serviceItems = computed(() => services.value);
  const providerItems = computed(() => providers.value);
  
  const canSubmit = computed(() => !!(selectedServiceId.value && selectedProviderId.value && selectedDate.value && selectedTime.value));
  
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
  }
  </script>

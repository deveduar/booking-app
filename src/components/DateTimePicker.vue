<template>
    <v-row class="mt-3">
      <v-col cols="12" md="6">
        <v-date-input
          label="Select a date"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          variant="outlined"
          bg-color="surface"
          hide-details
          color="primary"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="selectedTime"
          :active="menu2"
          :focus="menu2"
          label="Select a time"
          prepend-inner-icon="mdi-clock-time-four-outline"
          bg-color="surface"
          color="primary"
          variant="outlined"
          hide-details
          readonly
          @click="menu2 = true"
        >
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            activator="parent"
            transition="scale-transition"
            @click:outside="menu2 = false"
          >
            <v-time-picker
              v-if="menu2"
              v-model="selectedTime"
              full-width
            />
          </v-menu>
        </v-text-field>
      </v-col>
    </v-row>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const menu2 = ref(false);
  const selectedTime = ref('');
  </script>
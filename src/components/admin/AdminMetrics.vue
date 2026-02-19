<template>
  <v-row class="mb-6">
    <v-col cols="12" sm="4">
      <v-card color="primary" theme="dark">
        <v-card-text class="d-flex align-center">
          <v-icon size="48" class="mr-4">mdi-briefcase-outline</v-icon>
          <div>
            <div class="text-h4 font-weight-bold">{{ serviceCount }}</div>
            <div class="text-subtitle-1">Services</div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <v-card color="secondary" theme="dark">
        <v-card-text class="d-flex align-center">
          <v-icon size="48" class="mr-4">mdi-account-group-outline</v-icon>
          <div>
            <div class="text-h4 font-weight-bold">{{ providerCount }}</div>
            <div class="text-subtitle-1">Specialists</div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <v-card color="info" theme="dark">
        <v-card-text class="d-flex align-center">
          <v-icon size="48" class="mr-4">mdi-calendar-check</v-icon>
          <div>
            <div class="text-h4 font-weight-bold">{{ appointmentCount }}</div>
            <div class="text-subtitle-1">Upcoming Appointments</div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  serviceCount: number;
  providerCount: number;
  appointmentCount: number;
}>();
</script>

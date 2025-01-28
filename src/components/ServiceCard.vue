<template>
    <v-card class="mx-auto" max-width="400" outlined>
      <v-card-title class="text-h6 font-weight-bold">
        {{ service.name }}
      </v-card-title>
      <v-card-subtitle class="text-body-1">
        {{ service.description }}
      </v-card-subtitle>
      <v-card-text>
        <div class="mb-2">
          <strong>Price:</strong> ${{ service.price.toFixed(2) }}
        </div>
        <div>
          <strong>Duration:</strong> {{ service.duration }} mins
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary" 
          @click="handleBooking"
          aria-label="Book Appointment"
        >
          Book Now
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script lang="ts">
  export default {
    name: "ServiceCard",
    props: {
      service: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const handleBooking = () => {
        console.log(`Booking service: ${props.service.name}`);
      };
  
      return {
        handleBooking,
        service: props.service, // Hacer `service` accesible en el template
      };
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    transition: box-shadow 0.3s ease;
  }
  .v-card:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }
  </style>
  
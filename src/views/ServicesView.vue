<template>
    <v-container >
      <!-- Header Section -->
      <v-row class="">
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold mb-4">Our Services</h1>
        </v-col>
      </v-row>
  
      <!-- Filter and Sort Options -->
      <v-row class="mb-4">
        <v-col cols="12" md="6" lg="4">
          <v-select
            v-model="selectedCategory"
            :items="categories"
            label="Filter by Category"
            outlined
            dense
          ></v-select>
        </v-col>
  
        <v-col cols="12" md="6" lg="4">
          <v-select
            v-model="sortOption"
            :items="sortOptions"
            label="Sort by"
            outlined
            dense
          ></v-select>
        </v-col>
      </v-row>
  
      <!-- Service List -->
      <v-row v-if="filteredServices.length > 0" class="d-flex justify-start">
        <v-col
          v-for="service in filteredServices"
          :key="service.id"
          cols="12" md="6" lg="4"
        >
          <v-card>
            <v-card-title class="text-h5">{{ service.name }}</v-card-title>
            <v-card-subtitle>{{ service.description }}</v-card-subtitle>
  
            <v-card-text>
              <div>Price: ${{ service.price }}</div>
              <div>Duration: {{ service.duration }} min</div>
            </v-card-text>
  
            <v-card-actions>
              <v-btn
                color="primary"
                @click="goToBookingPage(service)"
              >
                Book Now
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Empty State -->
      <v-row v-else>
        <v-col cols="12" class="text-center">
          <v-alert type="info" icon="mdi-information" elevation="2">
            No services available at the moment. Check back later!
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { servicesData } from '@/data/servicesData'; 

export default {
  name: 'ServicesView',
  setup() {
    // Placeholder data for services
    const services = ref(servicesData);

    // Filter and sort options
    const selectedCategory = ref('All'); // Default to 'All'
    const sortOption = ref('price'); // Default to sort by price
    const categories = ref(['All', 'Haircuts', 'Coloring', 'Treatments']);
    const sortOptions = ref(['price', 'duration']);

    // Computed property to filter and sort services
    const filteredServices = computed(() => {
      let filtered = [...services.value]; // Create a shallow copy of services

      // If 'All' is selected or no category is selected, show all services
      if (selectedCategory.value && selectedCategory.value !== 'All') {
        filtered = filtered.filter(
          (service) => service.category === selectedCategory.value
        );
      }

      // Sort by selected option (price or duration)
      if (sortOption.value === 'price') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortOption.value === 'duration') {
        filtered.sort((a, b) => a.duration - b.duration);
      }

      return filtered;
    });

    // Watch effect to log and debug if necessary
    watchEffect(() => {
      console.log(`Sorted by: ${sortOption.value}`);
    });

    // Redirect to the booking page with the selected service ID
    const goToBookingPage = (service: any) => {
      console.log(`Navigating to booking page for service: ${service.name}`);
    };

    return {
      services,
      selectedCategory,
      sortOption,
      categories,
      sortOptions,
      filteredServices,
      goToBookingPage,
    };
  },
};

  </script>
  
  <style scoped>
  /* .v-container {
    padding: 20px;
  }
  
  .v-header {
    font-weight: bold;
  }
  
  .v-card-title {
    font-size: 1.25rem;
  }
  
  .v-card-subtitle {
    color: #555;
  }
  
  .v-card-text {
    font-size: 1rem;
  }
  
  .v-btn {
    width: 100%;
  } */
  </style>
  
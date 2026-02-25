<template>
  <v-container>
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
        <!-- Using ServiceCard component here -->
        <ServiceCard :service="service" />
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
import { storeToRefs } from 'pinia';
import { useServicesStore } from '@/stores/services';
import ServiceCard from '@/components/ServiceCard.vue'; // Import ServiceCard component

export default {
  name: 'ServicesView',
  components: {
    ServiceCard, // Register ServiceCard component
  },
  setup() {
    const servicesStore = useServicesStore();
    const { services, categories: storeCategories } = storeToRefs(servicesStore);

    // Filter and sort options
    const selectedCategory = ref('All'); // Default to 'All'
    const sortOption = ref('price'); // Default to sort by price
    const categories = ref<string[]>([]);
    const sortOptions = ref(['price', 'duration']);

    // Computed property to filter and sort services
    const filteredServices = computed(() => {
      let filtered = services.value.filter(s => s.isVisible !== false); // Filter visible services only

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

    // Watch effect to keep categories in sync and log sort option if needed
    watchEffect(() => {
      categories.value = ['All', ...storeCategories.value];
    });

    return {
      services,
      selectedCategory,
      sortOption,
      categories,
      sortOptions,
      filteredServices,
    };
  },
};
</script>

<style scoped>
/* You can add additional styling here */
</style>

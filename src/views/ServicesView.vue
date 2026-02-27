<template>
  <v-container>
    <!-- Header Section -->
    <v-row class="">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">Our Services</h1>
      </v-col>
    </v-row>

    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="5" md="4">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Category"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-filter-variant"
        ></v-select>
      </v-col>

      <v-col cols="12" sm="7" md="6" class="d-flex align-center ga-2">
        <v-select
          v-model="sortOption"
          :items="sortOptions"
          item-title="title"
          item-value="value"
          label="Sort by"
          variant="outlined"
          density="comfortable"
          hide-details
          prepend-inner-icon="mdi-sort-variant"
          class="flex-grow-1"
        ></v-select>

        <v-btn-toggle
          v-model="sortDirection"
          mandatory
          color="primary"
          variant="outlined"
          density="comfortable"
          style="height: 48px" 
        >
          <v-btn value="asc" icon="mdi-sort-ascending" class="px-2"></v-btn>
          <v-btn value="desc" icon="mdi-sort-descending" class="px-2"></v-btn>
        </v-btn-toggle>
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
    const selectedCategory = ref('All'); 
    const sortOption = ref('name'); 
    const sortDirection = ref<'asc' | 'desc'>('asc');
    const categories = ref<string[]>([]);
    const sortOptions = ref([
      { title: 'Name', value: 'name' },
      { title: 'Price', value: 'price' },
      { title: 'Duration', value: 'duration' }
    ]);

    // Computed property to filter and sort services
    const filteredServices = computed(() => {
      let filtered = services.value.filter(s => s.isVisible !== false); // Filter visible services only

      // If 'All' is selected or no category is selected, show all services
      if (selectedCategory.value && selectedCategory.value !== 'All') {
        filtered = filtered.filter(
          (service) => service.category === selectedCategory.value
        );
      }

      // Sort by selected option
      filtered.sort((a: any, b: any) => {
        let valA = a[sortOption.value];
        let valB = b[sortOption.value];
        
        // Handle number types vs string types
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        
        if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1;
        return 0;
      });

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
      sortDirection,
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

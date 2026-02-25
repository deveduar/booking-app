<template>
  <div>
    <h1 class="text-h5 font-weight-bold mt-10 ml-2">Featured services</h1>
    <v-row class="mt-2">
      <v-col 
        v-for="service in featuredServices" 
        :key="service.id"
        cols="12" 
        sm="4"
      >
        <ServiceCard :service="service" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import ServiceCard from '@/components/ServiceCard.vue';
import type { Service } from '@/stores/services';

defineProps<{
  featuredServices: Service[];
}>();
</script>

<template>
  <div>
    <h1 class="text-h5 font-weight-bold mt-10 ml-2">Our Experts</h1>
    <v-row class="mt-2">
      <v-col v-for="p in featuredExperts" :key="p.id" cols="12" sm="4">
        <v-card class="text-center pa-4">
          <v-avatar size="100" class="mb-4">
            <v-img v-if="p.image" :src="p.image" cover />
            <v-icon v-else icon="mdi-account" size="64" color="grey-lighten-1" />
          </v-avatar>
          <div class="text-h6 font-weight-bold">{{ p.name }}</div>
          <div class="d-flex align-center justify-center mb-2">
            <div v-if="!p.serviceIds || p.serviceIds.length === 0" class="text-subtitle-2 text-error font-weight-bold">Not Available</div>
            <div v-else class="text-subtitle-2 text-primary">{{ p.status }}</div>
          </div>
          <div class="text-body-2 mb-4 px-4 text-medium-emphasis text-truncate-2" style="min-height: 48px;">
            {{ p.description || 'Expert stylist ready to help you look your best.' }}
          </div>
          <v-btn 
            color="primary" 
            variant="tonal" 
            block 
            :disabled="!p.serviceIds || p.serviceIds.length === 0"
            @click="$emit('book', p)"
          >
            {{ (!p.serviceIds || p.serviceIds.length === 0) ? 'Unavailable' : `Book with ${p.name}` }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Provider } from '@/stores/providers';

defineProps<{
  featuredExperts: Provider[];
}>();

defineEmits<{
  (e: 'book', provider: Provider): void;
}>();
</script>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

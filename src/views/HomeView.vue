<template>
  <v-container >
    <!-- Admin Dashboard -->
    <HomeAdminDashboard v-if="isAdmin && user" :user-name="user.name" />

    <!-- User Dashboard -->
    <HomeUserDashboard v-else-if="isAuthenticated && user" :user-name="user.name" />

    <!-- Guest Hero -->
    <HomeHero v-else :hero="hero" />

    <!-- Featured Services Section -->
    <HomeFeaturedServices :featured-services="featuredServices" />
  
    <!-- Navigation Links (Guest Only) -->
    <v-row class="my-6" v-if="!isAuthenticated">
      <v-col cols="12" sm="6">
        <v-btn to="/register" block variant="outlined" color="primary" size="large">
          Create Account
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn to="/login" block variant="elevated" color="primary" size="large">
          Sign In
        </v-btn>
      </v-col>
    </v-row>

    <!-- Experts Section -->
    <HomeFeaturedExperts 
      :featured-experts="featuredExperts" 
      @book="handleBookWithProvider"
    />

    <!-- Testimonials Section -->
    <HomeTestimonials :testimonials="testimonials" />

    <!-- Notification Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      color="error"
      elevation="24"
    >
      {{ snackbarText }}
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

// Stores
import { useServicesStore } from '@/stores/services';
import { useProvidersStore } from '@/stores/providers';
import { useSettingsStore } from '@/stores/settings';
import { useAuthStore } from '@/stores/auth';

// Types
import type { Provider } from '@/stores/providers';

// Components
import HomeHero from '@/components/home/HomeHero.vue';
import HomeFeaturedServices from '@/components/home/HomeFeaturedServices.vue';
import HomeFeaturedExperts from '@/components/home/HomeFeaturedExperts.vue';
import HomeTestimonials from '@/components/home/HomeTestimonials.vue';
import HomeAdminDashboard from '@/components/home/HomeAdminDashboard.vue';
import HomeUserDashboard from '@/components/home/HomeUserDashboard.vue';

const servicesStore = useServicesStore();
const { services } = storeToRefs(servicesStore);

const providersStore = useProvidersStore();
const { providers } = storeToRefs(providersStore);

const settingsStore = useSettingsStore();
const { hero } = storeToRefs(settingsStore);

const authStore = useAuthStore();
const { user, isAuthenticated, isAdmin } = storeToRefs(authStore);

const featuredServices = computed(() => {
  return services.value.filter(s => s.isFeatured && s.isVisible !== false);
});

const featuredExperts = computed(() => {
  return providers.value.filter(p => p.isFeatured);
});

// Optional testimonials for the homepage
const testimonials = ref([
  { name: 'Jane Doe', testimonial: 'I love the services here, always feel pampered!' },
  { name: 'John Smith', testimonial: 'Best salon experience I’ve had, highly recommend!' },
]);



const router = useRouter();
const snackbar = ref(false);
const snackbarText = ref('');

function handleBookWithProvider(provider: Provider) {
  if (!provider.serviceIds || provider.serviceIds.length === 0) {
    snackbarText.value = `${provider.name} is currently not available for bookings.`;
    snackbar.value = true;
    return;
  }

  // Determine service to pre-select
  let serviceId = provider.preferredServiceId;
  
  // If preferred service is not in the assigned list (e.g. removed), fallback to first
  if (!serviceId || !provider.serviceIds.includes(serviceId)) {
    serviceId = provider.serviceIds[0];
  }

  router.push({
    path: '/booking',
    query: {
      providerId: provider.id,
      serviceId: serviceId
    }
  });
}
</script>

<style scoped>
/* Add custom styles if needed */
.v-btn {
  font-weight: bold;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <v-container>
    <!-- Header Section -->
    
    <v-row
      class="d-flex align-center justify-center"
      no-gutters
    >
      <v-col cols="12" md="6" class="d-flex flex-column justify-center align-center">
        <h1 class="display-2 font-weight-bold text-center">Glamour Salon</h1>
        <p class="subheading text-center">
          Your go-to destination for premium hair care and styling.
        </p>
        <!-- CTA Button -->
        <v-btn
          color="primary"
          to="/booking"
          large
          class="mt-4 "
        >
          Book Now
        </v-btn>
      </v-col>

      <v-col cols="12" md="6" class="d-flex justify-center mt-5">
        <!-- Image Carousel -->
        <v-carousel
          height="400"
          show-arrows="hover"
          cycle
          hide-delimiter-background
        >
          <v-carousel-item
            v-for="(item, i) in images"
            :key="i"
            :src="item.src"
          >
            
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>

    <!-- Navigation Links -->
    <v-row class="my-6">
      <v-col cols="12" sm="4">
        <v-btn to="/services" block variant="outlined" color="secondary">
          Services
        </v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn to="/register" block variant="outlined" color="secondary">
          Register
        </v-btn>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn to="/login" block variant="outlined" color="secondary">
          Login
        </v-btn>
      </v-col>
    </v-row>

    <!-- Testimonials Section (Optional) -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-center">What Our Clients Say</h2>
        <v-carousel
          height="200"
          width="100"
          cycle
          hide-delimiter-background
          :show-arrows="false"
          hide-delimiters
        >
          <v-carousel-item
            v-for="(item, i) in testimonials"
            :key="i"
            
          >
            <v-card class="mx-auto mt-10" max-width="400">
              <v-card-text class="text-center">
                <p>"{{ item.testimonial }}"</p>
                <p><strong>- {{ item.name }}</strong></p>
              </v-card-text>
            </v-card>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Array of images for the carousel
const images = ref([
  { src: 'https://placehold.co/600x400' },
  { src: 'https://placehold.co/600x400/transparent/F00' },
  { src: 'https://placehold.co/600x400?text=Hello+World' },
]);

// Optional testimonials for the homepage
const testimonials = ref([
  { name: 'Jane Doe', testimonial: 'I love the services here, always feel pampered!' },
  { name: 'John Smith', testimonial: 'Best salon experience I’ve had, highly recommend!' },
]);
</script>

<style scoped>
/* Add custom styles if needed */
.v-btn {
  font-weight: bold;
}


</style>

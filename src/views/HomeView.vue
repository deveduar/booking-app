<template>
  <v-container >
    <!-- Header Section -->
    <v-row class="d-flex  justify-center">
      <!-- Carrusel con CTA superpuesto -->
      <v-col cols="12">
          <v-carousel
            height="400px"
            :show-arrows="false"
            hide-delimiter-background
            hide-delimiters
            cycle
          >
            <!-- Carrusel Item 1 -->
            <v-carousel-item
              v-for="(item, i) in images"
              :key="i"
              :src="item.src"
              cover
            >
              <!-- Overlay para el CTA -->
                <v-container
                  class="fill-height d-flex flex-column justify-center align-center text-center"
                >
                  <!-- CTA Info -->
                  <h1 class="text-white display-2 font-weight-bold mb-2">
                    Glamour Salon
                  </h1>
                  <p class="text-white text-h6">
                    Your go-to destination for premium hair care and styling.
                  </p>
                  <!-- CTA Button -->
                  <v-btn
                    color="primary"
                    to="/booking"
                    large
                    class="mt-4"
                  >
                    Book Now
                  </v-btn>
                </v-container>
            </v-carousel-item>
          </v-carousel>
      </v-col>
    </v-row>

    <h1 class="text-h5 font-weight-bold mt-10 ml-2">Featured services</h1>
    <v-row class="mt-2">
      <v-col cols="12" sm="4">
        <ServiceCard 
      :service="{
        id: 1,
        name: 'Haircut',
        description: 'A stylish haircut tailored to you.',
        price: 25,
        duration: 30,
        category: 'Hair'
      }"
    />
      </v-col>
      <v-col cols="12" sm="4">
        <ServiceCard 
          :service="{
            id: 4,
            name: 'Hair Coloring',
            description: 'Choose from a variety of hair colors and highlights.',
            price: 80,
            duration: 90,
            category: 'Coloring'
        }"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <ServiceCard 
          :service="{
          id: 7,
          name: 'Deep Conditioning',
          description: 'A treatment to nourish and restore your hair.',
          price: 40,
          duration: 60,
          category: 'Treatments',
        }"
        />
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
import ServiceCard from '@/components/ServiceCard.vue'

// Array of images for the carousel
const images = ref([
  { src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
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

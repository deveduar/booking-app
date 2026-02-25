<template>
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
</template>

<script setup lang="ts">
defineProps<{
  testimonials: { name: string; testimonial: string }[];
}>();
</script>

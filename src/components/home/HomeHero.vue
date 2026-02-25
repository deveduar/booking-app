<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12">
      <v-carousel
        height="400px"
        :show-arrows="false"
        hide-delimiter-background
        hide-delimiters
        cycle
      >
        <v-carousel-item
          v-for="(item, i) in hero.images"
          :key="i"
          :src="item.src"
          cover
        >
          <v-container
            class="fill-height d-flex flex-column justify-center align-center text-center"
          >
            <h1 class="text-white display-2 font-weight-bold mb-2">
              {{ hero.title }}
            </h1>
            <p class="text-white text-h6">
              {{ hero.subtitle }}
            </p>
            <v-btn
              color="primary"
              :to="hero.ctaLink"
              large
              class="mt-4"
            >
              {{ hero.ctaText }}
            </v-btn>
          </v-container>
        </v-carousel-item>
      </v-carousel>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    images: { src: string }[];
  }
}>();
</script>

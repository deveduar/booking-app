<template>
    <v-footer class=" ">
      <v-row justify="center" no-gutters class="w-full"> <!-- Centrado con v-row -->
        <v-col cols="12" class="text-center">
          <!-- Primera sección: Conéctate con nosotros -->
          <div class=" flex items-center justify-center w-full py-4 px-4">
            <strong class="mr-10">Get connected with us on social networks!</strong>
  
            <!-- <v-spacer ></v-spacer> -->
  
            <!-- Iconos centrados -->
            <v-btn
              v-for="icon in icons"
              :key="icon"
              :icon="icon"
              class="mx-2"
              size="medium"
              variant="plain"
            ></v-btn>
          </div>
        </v-col>
  
        <v-col cols="12" class="text-center">
          <!-- Segunda sección: Copyright -->
          <div class="px-4 py-2 text-center w-100">
            &copy; {{ new Date().getFullYear() }} Glamour Salon
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const icons = ref([
    'mdi-facebook',
    'mdi-twitter',
    'mdi-linkedin',
    'mdi-instagram',
  ]);
  </script>
  
<template>
    <v-footer class=" ">
      <v-row justify="center" no-gutters class="w-full"> <!-- Centrado con v-row -->
        <v-col cols="12" class="text-center">
          <!-- Primera sección: Conéctate con nosotros -->
          <div class=" flex items-center justify-center w-full py-4 px-4">
            <strong class="mr-4">{{ company.footerText }}</strong>
  
            <!-- <v-spacer ></v-spacer> -->
  
            <!-- Iconos centrados -->
            <v-btn
              v-for="link in company.socialLinks"
              :key="link.platform"
              :icon="link.icon"
              :href="link.url"
              target="_blank"
              class="mx-2"
              size="small"
              variant="plain"
            ></v-btn>
          </div>
        </v-col>
  
        <v-col cols="12" class="text-center">
          <!-- Segunda sección: Copyright -->
          <div class="px-4 py-2 text-center w-100">
            &copy; {{ new Date().getFullYear() }} {{ company.brandName }}
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </template>
  
  <script setup lang="ts">
  defineOptions({ name: 'AppFooter' })
  import { useSettingsStore } from '@/stores/settings';
  import { storeToRefs } from 'pinia';
  
  const settingsStore = useSettingsStore();
  const { company } = storeToRefs(settingsStore);
  </script>
  

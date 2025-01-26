<template>
    <v-row class="align-center justify-space-between">
      <v-col cols="auto">
        <v-btn icon>
          <v-icon>mdi-view-grid</v-icon>
        </v-btn>
        <span class="text-h6 font-weight-bold ml-2">Glamour</span>
      </v-col>
      <v-col cols="auto">
        <v-switch
          inset
          color="primary"
          @click="toggleTheme"
        />
      </v-col>
    </v-row>
  </template>
  
  <script setup lang="ts">
  import { useTheme } from 'vuetify';
  
  const theme = useTheme();
  
  function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
  }
  </script>
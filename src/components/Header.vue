<template>
      <!-- Toolbar -->
      <v-toolbar   :color="theme.global.name.value === 'dark' ? theme.current.value.colors.surface : theme.current.value.colors.surface" prominent
      

      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>Glamour</v-toolbar-title>
        <v-btn to="/" variant="text">Home</v-btn>
        <v-btn to="/booking" variant="text">Booking</v-btn>
        <v-btn to="/login" variant="text">Login</v-btn>
        <v-btn to="/register" variant="text">Register</v-btn>
  
        <!-- Interruptor de tema -->
        <v-switch
          inset
          color="primary"
          @click="toggleTheme"
        />
      </v-toolbar>
  </template>
  
  <script setup lang="ts">
  import { useTheme } from 'vuetify';
  
  // Manejo del tema global
  const theme = useTheme();
  
  function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
  }
  </script>
  
  <style scoped>
  .v-switch {
  display: flex;
  align-items: center;
  margin: 1rem;

}

  </style>
  
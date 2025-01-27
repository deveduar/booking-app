<template>
  <v-app>
    <!-- Barra de navegación (opcional) -->
    <!-- <v-app-bar app color="primary" dark>
      <v-toolbar-title>Glamour Salon</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" variant="text">Home</v-btn>
      <v-btn to="/booking" variant="text">Booking</v-btn>
      <v-btn to="/login" variant="text">Login</v-btn>
      <v-btn to="/register" variant="text">Register</v-btn>
    </v-app-bar> -->
    <!-- Header -->
    <Header />
<!-- Contenido principal -->
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Pie de página (opcional) -->
    <v-footer app color="primary" dark>
      <span>&copy; 2023 Glamour Salon</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
  import Header from './components/Header.vue';

</script>

<style>
/* Estilos globales (opcional) */
</style>
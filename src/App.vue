<template>
  <v-app>
    <Header />
    <v-main>
      <router-view></router-view>
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
  import Header from './components/Header.vue';
  import Footer from './components/Footer.vue';

</script>

<style>
/* Estilos globales (opcional) */
</style>
<template>
  <v-app>
    <!-- Navigation Drawer extracted to component -->
    <Sidebar v-model="drawer" />

    <!-- Header -->
    <Header :drawer="drawer" @toggle-drawer="toggleDrawer" />

    <!-- Main Content -->
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Footer -->
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import Footer from './components/Footer.vue';

// Estado del drawer
const drawer = ref(false);

// Método para alternar el drawer
function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>

<template>
    <v-list class="rounded-lg">
      <v-list-item
        v-for="stylist in stylists"
        :key="stylist.name"
      >
        <template v-slot:prepend>
          <v-avatar>
            <v-img :src="stylist.image" />
          </v-avatar>
        </template>
        <v-list-item-title>{{ stylist.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ stylist.status }}</v-list-item-subtitle>
        <template v-slot:append>
          <v-switch color="primary" hide-details />
        </template>
      </v-list-item>
    </v-list>
  </template>
  
  <script setup lang="ts">
  // Definir la interfaz para un estilista
  interface Stylist {
    name: string;
    status: string;
    image: string;
  }
  
  // Definir las props con tipado fuerte
  defineProps<{
    stylists: Stylist[];
  }>();
  </script>
  
  <style scoped>
  .v-list-item {
    border-radius: 12px;
    margin-bottom: 8px;
    /* background-color: red; */
  }
  </style>
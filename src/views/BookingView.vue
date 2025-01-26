<template>
    <v-app>
      <v-main>
        <v-container class="pa-10">
          <!-- Header -->
          <Header />
  
          <!-- Título y descripción -->
          <v-row class="mt-5">
            <v-col cols="12">
              <h1 class="text-h4 font-weight-bold">Book a Haircut</h1>
              <p class="text-subtitle-1">Select a date and time for your appointment</p>
            </v-col>
          </v-row>
  
          <!-- Selectores de fecha y hora -->
          <DateTimePicker />
  
          <!-- Lista de estilistas -->
          <v-row class="mt-5">
            <v-col cols="12">
              <h2 class="text-h6 font-weight-bold">Stylist</h2>
              <StylistList :stylists="stylists" />
            </v-col>
          </v-row>
  
          <!-- Botón de confirmación -->
          <v-row class="mt-5">
            <v-col cols="12">
              <v-btn block color="primary" size="large">Next</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup lang="ts">
  import Header from '../components/Header.vue';
  import StylistList from '../components/StylistList.vue';
  import DateTimePicker from '../components/DateTimePicker.vue';
  
  // Datos de los estilistas
  const stylists = [
    {
      name: 'Alexa',
      status: 'Available',
      image: 'https://cdn.usegalileo.ai/sdxl10/4d0bd9a4-2f47-4eeb-8fbf-5fb13eaf0a0b.png',
    },
    {
      name: 'Renee',
      status: 'Available',
      image: 'https://cdn.usegalileo.ai/sdxl10/7cb6bea5-df1a-43ff-97c9-cc743fe8520d.png',
    },
    {
      name: 'Samantha',
      status: 'Available',
      image: 'https://cdn.usegalileo.ai/sdxl10/014920d7-e0b4-4ffa-823a-811dd0d3cdbc.png',
    },
  ];
  </script>
<template>
  <v-app >
    <v-main>
      <v-container class="pa-10">
        <!-- Header -->
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

        <!-- Título y descripción -->
        <v-row class="mt-5">
          <v-col cols="12">
            <h1 class="text-h4 font-weight-bold">Book a Haircut</h1>
            <p class="text-subtitle-1">Select a date and time for your appointment</p>
          </v-col>
        </v-row>

        <!-- Selectores de fecha y hora -->
        <v-row class="mt-3">
          <v-col cols="12" md="6">
            <v-text-field
              label="Date"
              placeholder="Select a date"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
              bg-color="surface"
              hide-details
              color="primary"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Time"
              placeholder="Select a time"
              variant="outlined"
              prepend-inner-icon="mdi-clock"
              bg-color="surface"
              hide-details
              color="primary"
            />
          </v-col>
        </v-row>

        <!-- Lista de estilistas -->
        <v-row class="mt-5">
          <v-col cols="12">
            <h2 class="text-h6 font-weight-bold">Stylist</h2>
            <v-list class="rounded-lg">
              <v-list-item
                v-for="stylist in stylists"
                :key="stylist.name"
                :bg-color=" isDark ? 'background' : 'surface'"
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
import { useTheme } from 'vuetify';

// Estado del tema
const theme = useTheme();

const isDark = theme.global.current.value.dark;

// Función para cambiar el tema
function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

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

<style scoped>
/* Estilos personalizados */
.v-list-item {
  border-radius: 12px;
  margin-bottom: 8px;
}

.rounded-lg {
  border-radius: 12px;
  margin-bottom: 8px;
  margin-top: 1.6rem;
  /* border-color: black; */
  /* background-color: red; */
}
</style>
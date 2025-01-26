<!-- <script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style> -->

<!-- <template>
  <v-app>
    <v-main>
      <v-container>
        <h1 class="text-primary">Hola, Vuetify!</h1>
        <v-btn color="primary">Botón de ejemplo</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style> -->

<template>
  <v-app>
    <v-main>
      <v-container class="pa-10" style="background-color: #F9FAFA;">
        <!-- Header -->
        <v-row class="align-center justify-space-between">
          <v-col cols="auto">
            <v-btn icon>
              <v-icon>mdi-view-grid</v-icon>
            </v-btn>
            <span class="text-h6 font-weight-bold ml-2" style="color: #1C1D22;">Glamour</span>
          </v-col>
          <v-col cols="auto">
            <v-avatar>
              <v-img src="https://cdn.usegalileo.ai/sdxl10/3bcb4a13-a797-4480-b43d-dfe101c8ef09.png" />
            </v-avatar>
          </v-col>
        </v-row>

        <!-- Título y descripción -->
        <v-row class="mt-5">
          <v-col cols="12">
            <h1 class="text-h4 font-weight-bold" style="color: #1C1D22;">Book a Haircut</h1>
            <p class="text-subtitle-1" style="color: #3C3F4A;">Select a date and time for your appointment</p>
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
              bg-color="#EEEFF2"
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
              bg-color="#EEEFF2"
              hide-details
              color="primary"
            />
          </v-col>
        </v-row>

        <!-- Lista de estilistas -->
        <v-row class="mt-5">
          <v-col cols="12">
            <h2 class="text-h6 font-weight-bold" style="color: #1C1D22;">Stylist</h2>
            <v-list>
              <v-list-item
                v-for="stylist in stylists"
                :key="stylist.name"
                style="background-color: #F9FAFA;"
              >
                <template v-slot:prepend>
                  <v-avatar>
                    <v-img :src="stylist.image" />
                  </v-avatar>
                </template>
                <v-list-item-title style="color: #1C1D22;">{{ stylist.name }}</v-list-item-title>
                <v-list-item-subtitle style="color: #3C3F4A;">{{ stylist.status }}</v-list-item-subtitle>
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
]
</script>

<style scoped>
/* Estilos personalizados */
.v-list-item {
  /* border-radius: 12px; */
  /* margin-bottom: 8px; */
}
</style>
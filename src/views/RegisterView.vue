<!-- <template>
    <v-container>
      <h1>Home</h1>
      <p>Welcome to Glamour Salon!</p>
    </v-container>
  </template>
  
  <script setup lang="ts">
  </script> -->
  <template>
    <v-container >
      <v-row
        justify="center"
        class="text-center"
      >
        <v-col cols="12" md="6">
          <h1 class="display-2 font-weight-bold">Glamour Salon</h1>
          <p class="subheading">
            Your go-to destination for premium hair care and styling.
          </p>
          <!-- CTA Button -->
          <v-btn
            color="primary"
            @click="$router.push('/booking')"
            large
            class="mt-4"
          >
            Book Now
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  // Lógica de la vista
  </script>
  
  <style scoped>
  /* Puedes agregar aquí estilos personalizados si es necesario */
  </style>
  
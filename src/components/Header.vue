<template>
  <v-app-bar
    :color="theme.global.name.value === 'dark' ? theme.current.value.colors.surface : theme.current.value.colors.surface"
    app
  >
    <!-- Botón para alternar el menú lateral -->
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />

    <!-- Título del toolbar -->
    <v-toolbar-title>YourBrand</v-toolbar-title>

    <!-- Espaciador para separar el título de los botones -->
    <v-spacer></v-spacer>

    <!-- Botones de navegación -->
    <v-btn
      v-for="(item, index) in navbarItems"
      :key="index"
      :to="item.to"
      variant="text"
    >
      {{ item.label }}
    </v-btn>

    <!-- Interruptor de tema -->
    <v-switch
      inset
      color="primary"
      v-model="isDarkTheme"
      @change="onSwitchChange"
      class="theme-switch"
    />
  </v-app-bar>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppHeader' })
import { useTheme } from 'vuetify';
import { ref, onMounted } from 'vue';

// Tipo explícito para el tema
const theme = useTheme();

const navbarItems = ref([
  { label: 'Home', to: '/' },
  { label: 'Booking', to: '/booking' },
  { label: 'Services', to: '/services' },
  { label: 'Admin', to: '/admin' },
  { label: 'Appointments', to: '/appointments' },
  { label: 'Sign In', to: '/login' },
  { label: 'Sign Up', to: '/register' },
  { label: 'About', to: '/about' },
]);


// Estado del interruptor (dark/light theme)
const isDarkTheme = ref<boolean>(false);

// Función para alternar el tema
function toggleTheme(isDark: boolean) {
  const newTheme = isDark ? 'dark' : 'light';
  theme.global.name.value = newTheme;  // Acceder a .value para asignar el valor real
  localStorage.setItem('theme', newTheme);
}

// Función que maneja el cambio del interruptor
function onSwitchChange() {
  toggleTheme(isDarkTheme.value); // Usar .value para obtener el valor real
}

// Configuración inicial del tema y el estado del switch desde localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme.global.name.value = savedTheme;  // Acceder a .value
    isDarkTheme.value = savedTheme === 'dark';
  } else {
    // Configuración predeterminada si no hay un tema guardado
    isDarkTheme.value = theme.global.current.value.dark;
  }
});
</script>

<style scoped>
.theme-switch {
  display: flex;
  align-items: center;
  margin: 1rem;
}
</style>

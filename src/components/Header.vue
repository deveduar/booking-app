<template>
  <v-app-bar
    :color="theme.global.name.value === 'dark' ? theme.current.value.colors.surface : theme.current.value.colors.surface"
    app
  >
    <!-- Botón para alternar el menú lateral -->
    <v-app-bar-nav-icon 
      :icon="drawer ? 'mdi-close' : 'mdi-menu'" 
      @click="$emit('toggle-drawer')" 
    />

    <!-- Espaciador para separar el icono de los botones -->
    <v-spacer></v-spacer>

    <!-- Botones de navegación -->
    <v-btn
      v-for="(item, index) in navItems"
      :key="index"
      :to="item.to"
      :prepend-icon="item.icon"
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

const props = defineProps<{
  drawer: boolean;
}>();

import { useTheme } from 'vuetify';
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia';
import { navItems } from '@/constants/navigation';

// Tipo explícito para el tema
const theme = useTheme();

const settingsStore = useSettingsStore();
const { company } = storeToRefs(settingsStore);


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

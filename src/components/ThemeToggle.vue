<template>
  <v-btn
    icon
    variant="text"
    @click="toggleTheme"
    class="theme-toggle-btn"
    aria-label="Toggle theme"
  >
    <v-icon
      :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
      :color="isDark ? 'primary' : 'warning'"
    />
    <v-tooltip activator="parent" location="bottom">
      {{ isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}
    </v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

const isDark = computed(() => theme.global.name.value === 'dark');

function toggleTheme() {
  const newTheme = isDark.value ? 'light' : 'dark';
  theme.global.name.value = newTheme;
  localStorage.setItem('theme', newTheme);
}
</script>

<style scoped>
.theme-toggle-btn {
  transition: transform 0.3s ease;
}

.theme-toggle-btn:hover {
  transform: rotate(15deg) scale(1.1);
}
</style>

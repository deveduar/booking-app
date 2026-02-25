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

    <!-- Título del toolbar - Visible cuando el drawer está cerrado -->
    <v-toolbar-title v-if="!drawer" class="font-weight-bold d-flex align-center cursor-pointer" @click="$router.push('/')">
      <v-icon color="primary" icon="mdi-calendar-heart" size="small" class="mr-2" />
      {{ company.brandName }}
    </v-toolbar-title>

    <div class="d-none d-md-flex align-center ml-4">
      <v-btn
        v-for="(item, index) in leftNavItems"
        :key="index"
        :to="item.to"
        :prepend-icon="item.icon"
        variant="text"
        class="text-none"
      >
        {{ item.label }}
      </v-btn>
    </div>

    <!-- Espaciador -->
    <v-spacer></v-spacer>

    <!-- Botones del lado derecho (Settings, Login, etc) -->
    <div class="d-flex align-center">
      <v-btn
        v-for="(item, index) in rightNavItems"
        :key="index"
        :to="item.to"
        :icon="$vuetify.display.smAndDown"
        variant="text"
        class="text-none"
      >
        <v-icon v-if="$vuetify.display.smAndDown">{{ item.icon }}</v-icon>
        <template v-else>
          <v-icon start>{{ item.icon }}</v-icon>
          {{ item.label }}
        </template>
      </v-btn>

      <!-- User Menu -->
      <v-menu v-if="isAuthenticated && user" location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="ml-2">
            <v-avatar size="32">
              <v-img :src="user.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'"></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-list density="compact" width="200">
          <v-list-item
            :prepend-avatar="user.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'"
            :title="user.name"
            :subtitle="user.role"
          ></v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-item to="/settings" prepend-icon="mdi-account-cog" title="Profile Editor"></v-list-item>
          <v-list-item @click="handleLogout" prepend-icon="mdi-logout" title="Logout" color="error"></v-list-item>
        </v-list>
      </v-menu>

      <!-- Interruptor de tema -->
      <v-switch
        inset
        color="primary"
        v-model="isDarkTheme"
        @change="onSwitchChange"
        hide-details
        class="theme-switch ml-4"
      />
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppHeader' })

const props = defineProps<{
  drawer: boolean;
}>();

import { useTheme } from 'vuetify';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { navItems } from '@/constants/navigation';

// Tipo explícito para el tema
const theme = useTheme();
const router = useRouter();

const settingsStore = useSettingsStore();
const { company } = storeToRefs(settingsStore);

const authStore = useAuthStore();
const { user, isAuthenticated, isAdmin } = storeToRefs(authStore);

const leftNavItems = computed(() => {
  return navItems.filter(i => {
    if (i.position !== 'left') return false;
    if (i.requiresAuth && !isAuthenticated.value) return false;
    if (i.role && user.value?.role !== i.role) return false;
    return true;
  });
});

const rightNavItems = computed(() => {
  return navItems.filter(i => {
    if (i.position !== 'right') return false;
    if (i.guestOnly && isAuthenticated.value) return false;
    if (i.requiresAuth && !isAuthenticated.value) return false;
    if (i.role && user.value?.role !== i.role) return false;
    return true;
  });
});

function handleLogout() {
  authStore.logout();
  router.push('/');
}

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
}
.cursor-pointer {
  cursor: pointer;
}
</style>

<template>
  <v-navigation-drawer
    v-model="drawerInternal"
    app
    floating
    elevation="1"
  >
    <!-- Brand Section in Sidebar - Matches Header styling (64px height) -->
    <v-list-item 
      class="brand-section cursor-pointer px-4" 
      color="primary"
      to="/"
      link
      :active="false"
      style="height: 64px;"
    >
      <template #prepend>
        <v-icon color="primary" icon="mdi-calendar-heart" size="small" class="mr-2" />
      </template>
      <v-list-item-title class="font-weight-bold" style="font-size: 1.25rem;">
        {{ company.brandName }}
      </v-list-item-title>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="(item, index) in navItems"
        :key="index"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        link
        active-color="primary"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia';
import { navItems } from '@/constants/navigation';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const settingsStore = useSettingsStore();
const { company } = storeToRefs(settingsStore);

const drawerInternal = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
</script>

<style scoped>
/* .brand-section {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
} */
.letter-spacing-tight {
  letter-spacing: -0.5px !important;
}

.cursor-pointer {
  cursor: pointer;
}

/* Fix for dark mode active link flicker/fade */
.v-theme--dark :deep(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.15) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.v-theme--dark :deep(.v-list-item__overlay) {
  background-color: transparent !important;
}

.v-theme--dark :deep(.v-list-item--active .v-list-item__overlay) {
  opacity: 0 !important;
}

/* Transición suave para evitar parpadeos */
:deep(.v-list-item) {
  transition: background-color 0.2s ease, color 0.2s ease !important;
}
</style>

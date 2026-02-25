<template>
  <v-navigation-drawer
    v-model="drawerInternal"
    app
    floating
    elevation="1"
  >
    <!-- Brand Section in Sidebar -->
    <v-list-item class="py-6 brand-section" color="primary">
      <template #prepend>
        <v-icon color="primary" icon="mdi-calendar-heart" size="32" class="mr-3" />
      </template>
      <v-list-item-title class="text-h5 font-weight-black letter-spacing-tight">
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
.brand-section {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.letter-spacing-tight {
  letter-spacing: -0.5px !important;
}
</style>

<template>
  <div class="mt-4">
    <div class="text-subtitle-2 mb-1">{{ title || 'Specific Availability (Unique Dates)' }}</div>
    
    <!-- Slots list -->
    <v-list density="compact" bg-color="transparent" v-if="slots.length > 0">
      <v-list-item v-for="(slot, index) in slots" :key="index">
        {{ slot.date }}: {{ slot.times.join(', ') }}
        <template #append>
          <v-btn icon="mdi-delete" size="x-small" variant="text" @click="$emit('remove', index)" />
        </template>
      </v-list-item>
    </v-list>

    <!-- Add new slot -->
    <v-row dense class="align-center mt-1">
      <v-col cols="12">
        <DateTimePicker
          :date="newDate"
          :time="newTime"
          @update:date="$emit('update:newDate', $event)"
          @update:time="$emit('update:newTime', $event)"
          :duration="duration || undefined"
          scheduling-mode="Fixed Slots"
        />
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          prepend-icon="mdi-plus"
          size="small"
          variant="tonal"
          @click="$emit('add')"
          :disabled="!newDate || !newTime"
        >
          Add Slot
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import DateTimePicker from '@/components/DateTimePicker.vue'

defineProps<{
  slots: { date: string, times: string[] }[];
  newDate: string | null;
  newTime: string | null;
  duration?: number | null;
  title?: string;
}>();

defineEmits<{
  (e: 'add'): void;
  (e: 'remove', index: number): void;
  (e: 'update:newDate', val: string | null): void;
  (e: 'update:newTime', val: string | null): void;
}>();
</script>

```html
<template>
  <v-card variant="outlined" class="pa-4 bg-surface-variant rounded-lg">
    <div class="d-flex justify-space-between align-center mb-1">
      <div class="text-subtitle-1 font-weight-bold">Daily Booking Window</div>
      <v-chip size="small" color="primary" variant="flat">
        {{ formattedRange }}
      </v-chip>
    </div>
    <div class="text-caption opacity-70 mb-4">Define the range of hours available for booking each day.</div>

    <v-range-slider
      v-model="sliderValue"
      :min="0"
      :max="1440"
      :step="15"
      hide-details
      strict
      color="primary"
      track-color="grey-lighten-2"
      thumb-label="always"
    >
      <template #thumb-label="{ modelValue }">
        {{ formatLabel(modelValue) }}
      </template>
    </v-range-slider>

    <div class="d-flex justify-space-between mt-2 text-caption opacity-70">
      <span>12:00 AM</span>
      <span>12:00 PM</span>
      <span>12:00 AM</span>
    </div>

    <v-alert
      v-if="isToday"
      type="info"
      variant="tonal"
      density="compact"
      class="mt-4"
      icon="mdi-clock-alert-outline"
    >
      Current time is <strong>{{ currentFormatedTime }}</strong>. Use the slider to define today's availability.
    </v-alert>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { parseTimeMin, formatTimeMin, formatTimeHHmm } from '@/utils/timeUtils';

const props = defineProps<{
  start: string | null;
  end: string | null;
  date?: string | null; // For "today" context
}>();

const emit = defineEmits<{
  (e: 'update:start', v: string | null): void;
  (e: 'update:end', v: string | null): void;
}>();

const sliderValue = ref([
  props.start ? parseTimeMin(props.start) : 540, // 9:00 AM
  props.end ? parseTimeMin(props.end) : 1080    // 6:00 PM
]);

const isToday = computed(() => {
  if (!props.date) return false;
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return props.date === todayStr;
});

const currentFormatedTime = computed(() => {
  const now = new Date();
  return formatTimeMin(now.getHours() * 60 + now.getMinutes());
});

const formatLabel = (val: number) => {
  return formatTimeMin(val);
};

const formattedRange = computed(() => {
  return `${formatTimeMin(sliderValue.value[0])} - ${formatTimeMin(sliderValue.value[1])}`;
});

watch(sliderValue, (newVal) => {
  // Emit HH:mm (24h) for storage — v-time-picker requires this format
  emit('update:start', formatTimeHHmm(newVal[0]));
  emit('update:end', formatTimeHHmm(newVal[1]));
}, { deep: true });

// Sync from props
watch([() => props.start, () => props.end], ([s, e]) => {
  const sMin = s ? parseTimeMin(s) : 540;
  const eMin = e ? parseTimeMin(e) : 1080;
  if (sMin !== sliderValue.value[0] || eMin !== sliderValue.value[1]) {
    sliderValue.value = [sMin, eMin];
  }
});
</script>

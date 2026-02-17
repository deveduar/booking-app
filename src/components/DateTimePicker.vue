<template>
    <v-row class="mt-3">
      <v-col cols="12" md="6">
        <v-date-input
          v-model="internalDate"
          :allowed-dates="isAllowedDate"
          label="Select a date"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          variant="outlined"
          bg-color="surface"
          hide-details
          color="primary"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="selectedTime"
          :active="menu2"
          :focus="menu2"
          label="Select a time"
          prepend-inner-icon="mdi-clock-time-four-outline"
          bg-color="surface"
          color="primary"
          variant="outlined"
          hide-details
          readonly
          @click="menu2 = true"
        >
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            activator="parent"
            transition="scale-transition"
            @click:outside="menu2 = false"
          >
            <v-time-picker
              v-if="menu2"
              v-model="selectedTime"
              full-width
            />
          </v-menu>
        </v-text-field>
      </v-col>
    </v-row>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  
  export type AvailabilitySlot = {
    date: string
    times: string[]
  }

  const props = defineProps<{
    date: string | null
    time: string | null
    availableSlots?: AvailabilitySlot[]
  }>()
  const emit = defineEmits<{
    (e: 'update:date', v: string | null): void
    (e: 'update:time', v: string | null): void
  }>()
  
  const menu2 = ref(false);
  const selectedTime = ref(props.time ?? '');
  
  // Internal Date representation for v-date-input
  const internalDate = ref<Date | null>(null);

  // Sync internalDate from props.date
  watch(() => props.date, (newDate) => {
    // Only update internalDate if it's different from the current reformatted internalDate
    const currentInternalDateStr = internalDate.value ? 
      `${internalDate.value.getFullYear()}-${String(internalDate.value.getMonth() + 1).padStart(2, '0')}-${String(internalDate.value.getDate()).padStart(2, '0')}` : null;
    
    if (newDate === currentInternalDateStr) return;

    if (newDate && newDate !== '') {
      const parts = newDate.split('-');
      if (parts.length === 3) {
        // Create local date from parts
        internalDate.value = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      }
    } else {
      internalDate.value = null;
    }
  }, { immediate: true });
  
  // Restricted dates for the date picker
  const allowedDates = computed(() => {
    if (!props.availableSlots || props.availableSlots.length === 0) return null;
    return props.availableSlots.map(s => s.date);
  });

  const isAllowedDate = (val: any) => {
    if (!allowedDates.value) return true;
    const dateObj = (val instanceof Date) ? val : new Date(val);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    return allowedDates.value.includes(dateStr);
  };

  // Restricted times for the current date
  const allowedTimesForDate = computed(() => {
    if (!props.availableSlots || props.availableSlots.length === 0 || !internalDate.value) return null;
    const y = internalDate.value.getFullYear();
    const m = String(internalDate.value.getMonth() + 1).padStart(2, '0');
    const d = String(internalDate.value.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    const slot = props.availableSlots.find(s => s.date === dateStr);
    return slot ? slot.times : [];
  });

  watch(selectedTime, v => emit('update:time', v || null));
  
  watch(internalDate, (newVal) => {
    let dateStr: string | null = null;
    if (newVal) {
      const y = newVal.getFullYear();
      const m = String(newVal.getMonth() + 1).padStart(2, '0');
      const d = String(newVal.getDate()).padStart(2, '0');
      dateStr = `${y}-${m}-${d}`;
    }

    if (dateStr !== props.date) {
      emit('update:date', dateStr);
    }
    
    // Reset time if it's no longer valid for the new date
    if (allowedTimesForDate.value && selectedTime.value && !allowedTimesForDate.value.includes(selectedTime.value)) {
      selectedTime.value = '';
    }
  });

  // Sync time from props
  watch(() => props.time, v => { if (v !== selectedTime.value) selectedTime.value = v ?? '' });
  </script>

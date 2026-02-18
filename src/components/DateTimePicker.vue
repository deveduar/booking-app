<template>
    <v-row class="mt-3">
      <v-col cols="12" md="6">
        <!-- Use v-select for restricted dates, otherwise v-date-input -->
        <v-select
          v-if="availableSlots && availableSlots.length > 0"
          v-model="internalDateStr"
          :items="availableDates"
          label="Select a date"
          prepend-inner-icon="$calendar"
          variant="outlined"
          bg-color="surface"
          color="primary"
          hide-details
        />
        <v-date-input
          v-else
          v-model="internalDate"
          :allowed-dates="isAllowedDate"
          label="Select a date"
          prepend-icon=""
          prepend-inner-icon="$calendar"
          variant="outlined"
          bg-color="surface"
          hide-details
          color="primary"
          hide-actions
        />
      </v-col>
      <v-col cols="12" md="6">
        <!-- Use v-select for restricted times, otherwise v-text-field with v-time-picker -->
        <v-select
          v-if="availableSlots && availableSlots.length > 0"
          v-model="selectedTime"
          :items="allowedTimesForDate || []"
          :disabled="!internalDate"
          label="Select a time"
          prepend-inner-icon="mdi-clock-time-four-outline"
          bg-color="surface"
          color="primary"
          variant="outlined"
          hide-details
          :placeholder="!internalDate ? 'Select a date first' : 'Select a time'"
        />
        <v-text-field
          v-else
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

  export type Range = {
    start: string | null
    end: string | null
  }

  const props = defineProps<{
    date: string | null
    time: string | null
    availableSlots?: AvailabilitySlot[]
    dateRange?: Range
    timeRange?: Range
  }>()
  const emit = defineEmits<{
    (e: 'update:date', v: string | null): void
    (e: 'update:time', v: string | null): void
  }>()
  
  const menu2 = ref(false);
  const selectedTime = ref(props.time ?? '');
  
  // Internal Date representation for v-date-input
  const internalDate = ref<Date | null>(null);
  const internalDateStr = ref<string | null>(props.date);

  // Sync internalDate from props.date
  watch(() => props.date, (newDate) => {
    internalDateStr.value = newDate;
    
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

  watch(internalDateStr, (newVal) => {
    if (newVal !== props.date) {
      emit('update:date', newVal);
    }
  });
  
  // Restricted dates for the date picker
  const availableDates = computed(() => {
    if (!props.availableSlots || props.availableSlots.length === 0) return [];
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    return props.availableSlots
      .map(s => s.date)
      .filter(d => {
        // Filter out past dates
        if (d < todayStr) return false;
        // Filter range
        if (props.dateRange?.start && d < props.dateRange.start) return false;
        if (props.dateRange?.end && d > props.dateRange.end) return false;
        return true;
      });
  });

  const isAllowedDate = (val: any) => {
    const dateObj = (val instanceof Date) ? val : new Date(val);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Block past dates
    if (dateStr < todayStr) return false;

    // Block range
    if (props.dateRange?.start && dateStr < props.dateRange.start) return false;
    if (props.dateRange?.end && dateStr > props.dateRange.end) return false;

    // Block if not in availableSlots
    if (props.availableSlots && props.availableSlots.length > 0 && !availableDates.value.includes(dateStr)) return false;

    return true;
  };

  // Restricted times for the current date
  const allowedTimesForDate = computed(() => {
    if (!internalDateStr.value) return null;
    
    let times: string[] = [];
    if (props.availableSlots && props.availableSlots.length > 0) {
      const slot = props.availableSlots.find(s => s.date === internalDateStr.value);
      if (!slot) return [];
      times = slot.times;
    } else {
      // Default set of times if no specific slots, but ranges might apply
      // For now, if no slots, we don't return a restricted list unless ranges are active
      if (!props.timeRange?.start && !props.timeRange?.end) return null;
      // If ranges active, could define a set of steps. For now, we'll keep it simple:
      // if no slots, we allow anything (handled by time picker), but if slots exist we restrict.
      return null;
    }

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return times.filter(t => {
      // Past time block
      if (internalDateStr.value === todayStr) {
        // Parse "HH:MM AM/PM"
        const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
          let h = parseInt(match[1]);
          const m = parseInt(match[2]);
          const ampm = match[3].toUpperCase();
          if (ampm === 'PM' && h < 12) h += 12;
          if (ampm === 'AM' && h === 12) h = 0;
          if (h * 60 + m < currentTime) return false;
        }
      }

      // Range block (simple alphabetical comparison for HH:MM format might be tricky if not padded, 
      // but assuming consistent format from Admin)
      if (props.timeRange?.start && t < props.timeRange.start) return false;
      if (props.timeRange?.end && t > props.timeRange.end) return false;
      
      return true;
    });
  });

  // Sync time to parent
  watch(selectedTime, v => {
    if (v !== props.time) {
      emit('update:time', v || null);
    }
  });

  // Sync time from props
  watch(() => props.time, v => { if (v !== selectedTime.value) selectedTime.value = v ?? '' });

  // Reset time if it's no longer valid for the new date
  watch(() => props.date, () => {
    if (allowedTimesForDate.value && selectedTime.value && !allowedTimesForDate.value.includes(selectedTime.value)) {
      selectedTime.value = '';
    }
  }, { immediate: true });

  // Sync date from internalDate to parent
  watch(internalDate, (newVal) => {
    let dateStr: string | null = null;
    if (newVal) {
      // Create date string in YYYY-MM-DD format, handling timezones
      const y = newVal.getFullYear();
      const m = String(newVal.getMonth() + 1).padStart(2, '0');
      const d = String(newVal.getDate()).padStart(2, '0');
      dateStr = `${y}-${m}-${d}`;
    }

    if (dateStr !== props.date) {
      emit('update:date', dateStr);
    }
  });
  </script>

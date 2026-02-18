<template>
    <v-row class="mt-3">
      <v-col v-if="!hideDate" cols="12" :md="hideTime ? 12 : 6">
        <!-- If only one date is available, show as read-only text field -->
        <v-text-field
          v-if="availableSlots && availableSlots.length === 1 && !hideDate"
          :model-value="availableDates[0]"
          label="Date"
          prepend-inner-icon="$calendar"
          variant="outlined"
          bg-color="surface"
          readonly
          hide-details
        />
        <!-- Use v-select for restricted dates, otherwise v-date-input -->
        <v-select
          v-else-if="availableSlots && availableSlots.length > 0"
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
      <v-col v-if="!hideTime" cols="12" :md="hideDate ? 12 : 6">
        <!-- If only one time is available for this date, show as read-only -->
        <v-text-field
          v-if="allowedTimesForDate && allowedTimesForDate.length === 1"
          :model-value="allowedTimesForDate[0]"
          label="Time"
          prepend-inner-icon="mdi-clock-time-four-outline"
          variant="outlined"
          bg-color="surface"
          readonly
          hide-details
        />
        <!-- Use v-select ONLY for specific availableSlots -->
        <v-select
          v-else-if="availableSlots && availableSlots.length > 0"
          v-model="selectedTime"
          :items="allowedTimesForDate || []"
          :disabled="!internalDateStr"
          label="Select a time"
          prepend-inner-icon="mdi-clock-time-four-outline"
          bg-color="surface"
          color="primary"
          variant="outlined"
          hide-details
          :placeholder="!internalDateStr ? 'Select a date first' : 'Select a time'"
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
              :allowed-hours="allowedHours"
              :allowed-minutes="allowedMinutes"
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
    duration?: number
    hideDate?: boolean
    hideTime?: boolean
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
    } else if (props.timeRange?.start && props.timeRange?.end && props.duration) {
      // Generate slots from range and duration
      const parse = (t: string) => {
        const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return 0;
        let h = parseInt(match[1]);
        const m = parseInt(match[2]);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      };
      
      const format = (mTotal: number) => {
        let h = Math.floor(mTotal / 60);
        const m = mTotal % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        if (h === 0) h = 12;
        return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
      };

      const startMin = parse(props.timeRange.start);
      const endMin = parse(props.timeRange.end);
      const dur = props.duration;
      
      for (let cur = startMin; cur + dur <= endMin; cur += 30) { // Step by 30 mins or duration? User said duration but 30 is common. Let's use 30 for options, but ensures total < end.
        times.push(format(cur));
      }
    } else {
      return null;
    }

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return times.filter(t => {
      const tMin = parseTimeMin(t);
      // Past time block
      if (internalDateStr.value === todayStr) {
        if (tMin < currentTime) return false;
      }

      // Range block
      if (props.timeRange?.start && tMin < parseTimeMin(props.timeRange.start)) return false;
      if (props.timeRange?.end && tMin > parseTimeMin(props.timeRange.end)) return false;
      
      return true;
    });
  });

  function parseTimeMin(t: string | null) {
    if (!t) return 0;
    // Try AM/PM
    const matchAmpm = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (matchAmpm) {
      let h = parseInt(matchAmpm[1]);
      const m = parseInt(matchAmpm[2]);
      const ampm = matchAmpm[3].toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    }
    // Try 24h
    const match24 = t.match(/(\d+):(\d+)/);
    if (match24) {
      return parseInt(match24[1]) * 60 + parseInt(match24[2]);
    }
    return 0;
  }

  const allowedHours = (hour: number) => {
    if (!props.timeRange) return true;
    const start = props.timeRange.start ? parseTimeMin(props.timeRange.start) : 0;
    const end = props.timeRange.end ? parseTimeMin(props.timeRange.end) : 1439; // 23:59
    const startH = Math.floor(start / 60);
    const endH = Math.floor(end / 60);
    return hour >= startH && hour <= endH;
  };

  const allowedMinutes = (min: number) => {
    if (!props.timeRange || selectedTime.value === '') return true;
    
    // We need to know the current hour being selected in the picker.
    const current = parseTimeMin(selectedTime.value);
    const currentH = Math.floor(current / 60);
    const start = props.timeRange.start ? parseTimeMin(props.timeRange.start) : 0;
    const end = props.timeRange.end ? parseTimeMin(props.timeRange.end) : 1439;
    const startH = Math.floor(start / 60);
    const endH = Math.floor(end / 60);
    const startM = start % 60;
    const endM = end % 60;

    if (currentH === startH && currentH === endH) return min >= startM && min <= endM;
    if (currentH === startH) return min >= startM;
    if (currentH === endH) return min <= endM;
    return true;
  };

  // --- Watchers Section ---

  // Auto-set if only one option exists
  watch(() => availableDates.value, (dates) => {
    if (dates.length === 1) {
      internalDateStr.value = dates[0];
    } else if (internalDateStr.value && dates.length > 0 && !dates.includes(internalDateStr.value)) {
      internalDateStr.value = null;
    }
  }, { immediate: true });

  watch(() => allowedTimesForDate.value, (times) => {
    if (times && times.length === 1) {
      selectedTime.value = times[0];
    } else if (selectedTime.value && times && times.length > 0 && !times.includes(selectedTime.value)) {
      selectedTime.value = '';
    }
  }, { immediate: true });

  // Sync internalDateStr from props.date
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

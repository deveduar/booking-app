<template>
  <v-row class="mt-3">
    <v-col v-if="!hideDate" cols="12" :md="hideTime ? 12 : 6">
      <!-- If only one date is available, show as read-only text field -->
      <v-text-field
        v-if="schedulingMode === 'Fixed Slots' && availableSlots && availableSlots.length === 1"
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
        v-else-if="schedulingMode === 'Fixed Slots' && availableSlots && availableSlots.length > 0"
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
        v-if="schedulingMode === 'Fixed Slots' && allowedTimesForDate && allowedTimesForDate.length === 1"
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
        v-else-if="schedulingMode === 'Fixed Slots' && availableSlots && availableSlots.length > 0"
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
            :model-value="pickerTime"
            @update:model-value="onPickerTimeUpdate"
            :allowed-hours="allowedHours"
            :allowed-minutes="allowedMinutes"
            ampm-in-title
            format="ampm"
            full-width
          />
        </v-menu>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useDateTimePicker, type DateTimePickerProps } from '../composables/useDateTimePicker';

/**
 * DateTimePicker Component
 * 
 * A versatile date and time selection component that supports:
 * - Standard range-based selection (using Vuetify's calendar and time picker).
 * - Fixed slot selection (using dropdowns for pre-defined dates/times).
 * - Automatic filtering of past dates/times.
 * - Mutual restrictions between start and end time pickers.
 */

const props = defineProps<DateTimePickerProps>();
const emit = defineEmits<{
  /** Update the selected date (YYYY-MM-DD) */
  (e: 'update:date', v: string | null): void
  /** Update the selected time (h:mm AM/PM or HH:mm) */
  (e: 'update:time', v: string | null): void
}>();

const {
  menu2,
  selectedTime,
  pickerTime,
  onPickerTimeUpdate,
  internalDate,
  internalDateStr,
  availableDates,
  isAllowedDate,
  allowedTimesForDate,
  allowedHours,
  allowedMinutes
} = useDateTimePicker(props, emit);
</script>

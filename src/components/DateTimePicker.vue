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
        class="cursor-pointer"
      />
      <v-text-field
        v-else
        :model-value="internalDate ? formatDate(internalDateStr) : ''"
        :placeholder="dateFormat"
        label="Select a date"
        prepend-inner-icon="$calendar"
        variant="outlined"
        bg-color="surface"
        hide-details
        color="primary"
        readonly
        class="cursor-pointer"
        @click="menu1 = true"
      >
        <v-menu
          v-model="menu1"
          :close-on-content-click="false"
          activator="parent"
          transition="scale-transition"
          @click:outside="cancelDate"
        >
          <v-date-picker
            v-model="tempDate"
            :allowed-dates="isAllowedDate"
            color="primary"
            rounded="lg"
          >
            <template v-slot:actions>
              <v-btn variant="text" @click="cancelDate">Cancel</v-btn>
              <v-btn color="primary" @click="saveDate">OK</v-btn>
            </template>
          </v-date-picker>
        </v-menu>
      </v-text-field>
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
        class="cursor-pointer"
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
        class="cursor-pointer"
        @click="menu2 = true"
      >
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          activator="parent"
          transition="scale-transition"
          @click:outside="cancelTime"
        >
          <v-time-picker
            v-if="menu2"
            :model-value="tempPickerTime"
            @update:model-value="onPickerTimeUpdate"
            :allowed-hours="allowedHours"
            :allowed-minutes="allowedMinutes"
            :ampm-in-title="pickerFormat === 'ampm'"
            :format="pickerFormat"
            full-width
            rounded="lg"
          >
            <template v-slot:actions>
              <div class="d-flex justify-end w-100 pt-2">
                <v-btn variant="text" @click="cancelTime">Cancel</v-btn>
                <v-btn color="primary" @click="saveTime">OK</v-btn>
              </div>
            </template>
          </v-time-picker>
        </v-menu>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useDateTimePicker, type DateTimePickerProps } from '../composables/useDateTimePicker';
import { useSettings } from '@/composables/useSettings';

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

const { formatDate, dateFormat } = useSettings();

const {
  menu1,
  menu2,
  selectedTime,
  // pickerTime,
  tempPickerTime,
  tempDate,
  pickerFormat,
  saveTime,
  cancelTime,
  saveDate,
  cancelDate,
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

<style scoped>
.cursor-pointer :deep(input),
.cursor-pointer :deep(.v-field__input),
.cursor-pointer :deep(.v-field__append-inner),
.cursor-pointer :deep(.v-field__prepend-inner),
.cursor-pointer :deep(.v-select__selection),
.cursor-pointer :deep(.v-select__slot),
.cursor-pointer :deep(.v-field) {
  cursor: pointer !important;
}
</style>

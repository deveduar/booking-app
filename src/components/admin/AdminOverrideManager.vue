<template>
  <div class="mt-4">
    <v-divider class="my-4"></v-divider>
    <div class="text-h6 mb-2">Specialist Overrides (Advanced)</div>
    
    <v-row dense>
      <v-col cols="12">
        <v-select
          v-model="internalSelectedId"
          :items="assignedProviders"
          item-title="name"
          item-value="id"
          label="Select Specialist to Override"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
    </v-row>

    <div v-if="internalSelectedId" class="pa-4  rounded-lg border">
      <div class="text-subtitle-2 mb-2">Override for {{ overrideProviderName }}</div>
      
      <v-radio-group v-model="internalMode" label="Override Mode" inline>
        <v-radio label="Standard (Range)" value="Standard"></v-radio>
        <v-radio label="Fixed Slots" value="Fixed Slots"></v-radio>
      </v-radio-group>

      <!-- Mode: Fixed Slots -->
      <AdminSlotManager
        v-if="internalMode === 'Fixed Slots'"
        :slots="overrideSlots"
        :new-date="overDate"
        :new-time="overTime"
        title="Specific Slots for Specialist"
        @add="$emit('add-slot')"
        @remove="$emit('remove-slot', $event)"
        @update:new-date="$emit('update:overDate', $event)"
        @update:new-time="$emit('update:overTime', $event)"
      />
      
      <v-alert
        v-if="isFixedTodayPast"
        type="warning"
        variant="tonal"
        density="compact"
        class="mt-2"
        icon="mdi-clock-alert-outline"
      >
        Some <strong>Override Slots</strong> for today have already passed.
      </v-alert>

      <!-- Mode: Standard -->
      <div v-if="internalMode === 'Standard'">
        <v-row dense>
          <v-col cols="12" sm="6">
            <div class="text-caption">Start Date</div>
            <DateTimePicker :date="overDateRangeStart" :time="null" hideTime scheduling-mode="Standard"  @update:date="$emit('update:overDateRangeStart', $event)" />
          </v-col>
          <v-col cols="12" sm="6">
            <div class="text-caption">End Date</div>
            <DateTimePicker :date="overDateRangeEnd" :time="null" hideTime scheduling-mode="Standard"  @update:date="$emit('update:overDateRangeEnd', $event)" />
          </v-col>
          <v-col cols="12" class="mt-2">
            <TimeRangeSlider
              :start="overTimeRangeStart"
              :end="overTimeRangeEnd"
              :date="overDateRangeStart"
              @update:start="$emit('update:overTimeRangeStart', $event)"
              @update:end="$emit('update:overTimeRangeEnd', $event)"
            />
            <v-alert
              v-if="isRangeTodayPast"
              type="warning"
              variant="tonal"
              density="compact"
              class="mt-2"
              icon="mdi-clock-alert-outline"
            >
              This override range includes past hours for <strong>Today</strong>. Customers will only see slots from <strong>{{ currentFormatedTime }}</strong>.
            </v-alert>
          </v-col>
        </v-row>
      </div>

      <v-btn color="primary" variant="elevated" block class="mt-4" @click="$emit('save')" :disabled="!isValid">
        Save Specialist Override
      </v-btn>
    </div>

    <!-- Active Overrides List -->
    <div v-if="Object.keys(providerAvailability).length > 0" class="mt-4">
      <div class="text-subtitle-2 mb-2">Active Specialist Overrides:</div>
      <v-list density="compact" rounded-lg>
        <v-list-item v-for="(ov, pid) in providerAvailability" :key="pid">
          <template #prepend>
            <v-icon icon="mdi-account-star" color="primary" class="mr-2" />
          </template>
          <v-list-item-title>{{ getProviderName(Number(pid)) }}</v-list-item-title>
          
          <div class="text-caption mt-1">
            <v-chip size="x-small" label color="primary" variant="flat" class="mr-1">{{ ov.schedulingMode }}</v-chip>
            
            <span v-if="ov.schedulingMode === 'Standard'">
              {{ ov.dateRange?.start }} — {{ ov.dateRange?.end }}
              <span v-if="ov.timeRange?.start"> ({{ formatTime(ov.timeRange.start) }} — {{ formatTime(ov.timeRange.end) }})</span>
            </span>

            <div v-else class="mt-1">
              <div v-if="ov.availableSlots && ov.availableSlots.length > 0">
                <div v-for="(slot, idx) in ov.availableSlots.slice(0, 3)" :key="idx" class="ml-2">
                  • {{ slot.date }} <span class="text-grey">({{ slot.times.map(t => formatTime(t)).join(', ') }})</span>
                </div>
                <div v-if="ov.availableSlots.length > 3" class="text-grey font-italic ml-2">
                  +{{ ov.availableSlots.length - 3 }} more days...
                </div>
              </div>
              <div v-else class="text-grey font-italic ml-2">
                No slots defined
              </div>
            </div>
          </div>
          <template #append>
            <v-btn icon="mdi-pencil" size="x-small" variant="text" @click="$emit('edit-override', Number(pid))" class="mr-1" />
            <v-btn icon="mdi-delete" size="x-small" variant="text" color="error" @click="$emit('remove-override', Number(pid))" />
          </template>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getTodayStr, parseTimeMin, formatTimeMin } from '@/utils/timeUtils'
import { useSettings } from '@/composables/useSettings'
import DateTimePicker from '@/components/DateTimePicker.vue'
import TimeRangeSlider from './TimeRangeSlider.vue'
import AdminSlotManager from './AdminSlotManager.vue'
import type { AvailabilityOverride, AvailabilitySlot } from '@/stores/services'

const props = defineProps<{
  editingServiceId: number | null;
  selectedProviderId: number | null;
  schedulingMode: 'Standard' | 'Fixed Slots';
  assignedProviders: { id: number; name: string }[];
  overrideProviderName: string;
  overrideSlots: AvailabilitySlot[];
  overDate: string | null;
  overTime: string | null;
  overDateRangeStart: string | null;
  overDateRangeEnd: string | null;
  overTimeRangeStart: string | null;
  overTimeRangeEnd: string | null;
  providerAvailability: { [id: number]: AvailabilityOverride };
  duration: number | null;
  isValid: boolean;
  getProviderName: (id: number) => string;
}>();

const emit = defineEmits([
  'update:selectedProviderId',
  'update:schedulingMode',
  'update:overDate',
  'update:overTime',
  'update:overDateRangeStart',
  'update:overDateRangeEnd',
  'update:overTimeRangeStart',
  'update:overTimeRangeEnd',
  'add-slot',
  'remove-slot',
  'save',
  'edit-override',
  'remove-override'
]);

const { timeFormat, formatTime } = useSettings();

const internalSelectedId = computed({
  get: () => props.selectedProviderId,
  set: (val) => emit('update:selectedProviderId', val)
});

const internalMode = computed({
  get: () => props.schedulingMode,
  set: (val) => emit('update:schedulingMode', val)
});

// Time Warnings Logic
const nowMin = computed(() => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
});

const currentFormatedTime = computed(() => formatTimeMin(nowMin.value, timeFormat.value as '12h'|'24h'));

const isRangeTodayPast = computed(() => {
  if (internalMode.value !== 'Standard' || !props.overDateRangeStart || !props.overTimeRangeStart) return false;
  const today = getTodayStr();
  if (props.overDateRangeStart === today) {
    return parseTimeMin(props.overTimeRangeStart) < nowMin.value;
  }
  return false;
});

const isFixedTodayPast = computed(() => {
  if (internalMode.value !== 'Fixed Slots' || !props.overrideSlots) return false;
  const today = getTodayStr();
  return props.overrideSlots.some(s => 
    s.date === today && s.times.some((t: string) => parseTimeMin(t) < nowMin.value)
  );
});
</script>

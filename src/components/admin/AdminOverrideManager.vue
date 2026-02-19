<template>
  <div v-if="editingServiceId" class="mt-4">
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

    <div v-if="internalSelectedId" class="pa-4 bg-surface-variant rounded-lg border">
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

      <!-- Mode: Standard -->
      <div v-if="internalMode === 'Standard'">
        <v-row dense>
          <v-col cols="12" sm="6">
            <div class="text-caption">Start Date</div>
            <DateTimePicker :date="overDateRangeStart" :time="null" hideTime scheduling-mode="Standard" @update:date="$emit('update:overDateRangeStart', $event)" />
          </v-col>
          <v-col cols="12" sm="6">
            <div class="text-caption">End Date</div>
            <DateTimePicker :date="overDateRangeEnd" :time="null" hideTime scheduling-mode="Standard" @update:date="$emit('update:overDateRangeEnd', $event)" />
          </v-col>
          <v-col cols="12" sm="6">
            <div class="text-caption">Start Time</div>
            <DateTimePicker :date="null" :time="overTimeRangeStart" hideDate :duration="duration || undefined" :time-range="{ start: null, end: overTimeRangeEnd }" scheduling-mode="Standard" @update:time="$emit('update:overTimeRangeStart', $event)" />
          </v-col>
          <v-col cols="12" sm="6">
            <div class="text-caption">End Time</div>
            <DateTimePicker :date="null" :time="overTimeRangeEnd" hideDate :duration="duration || undefined" :time-range="{ start: overTimeRangeStart, end: null }" scheduling-mode="Standard" @update:time="$emit('update:overTimeRangeEnd', $event)" />
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
          <v-list-item-subtitle>
            <v-chip size="x-small" label color="primary" variant="flat" class="mr-1">{{ ov.schedulingMode }}</v-chip>
            <span v-if="ov.schedulingMode === 'Standard'">
              {{ ov.dateRange?.start }} — {{ ov.dateRange?.end }}
              <span v-if="ov.timeRange?.start"> ({{ ov.timeRange.start }} — {{ ov.timeRange.end }})</span>
            </span>
            <span v-else>
              {{ ov.availableSlots?.map(s => s.date).slice(0, 2).join(', ') }}
              <span v-if="ov.availableSlots && ov.availableSlots.length > 2">... (+{{ ov.availableSlots.length - 2 }} more)</span>
            </span>
          </v-list-item-subtitle>
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
import DateTimePicker from '@/components/DateTimePicker.vue'
import AdminSlotManager from './AdminSlotManager.vue'
import type { AvailabilityOverride } from '@/stores/services'

const props = defineProps<{
  editingServiceId: number | null;
  selectedProviderId: number | null;
  schedulingMode: 'Standard' | 'Fixed Slots';
  assignedProviders: any[];
  overrideProviderName: string;
  overrideSlots: any[];
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

const internalSelectedId = computed({
  get: () => props.selectedProviderId,
  set: (val) => emit('update:selectedProviderId', val)
});

const internalMode = computed({
  get: () => props.schedulingMode,
  set: (val) => emit('update:schedulingMode', val)
});
</script>

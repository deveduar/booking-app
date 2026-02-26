<template>
  <v-card class="d-flex flex-column" style="max-height: 90vh;">
    <v-card-title class="d-flex align-center justify-space-between flex-shrink-0 " style="position: sticky; top: 0; z-index: 10;">
      {{ editingId ? 'Edit Service' : 'Add New Service' }}
      <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('cancel')" />
    </v-card-title>
    <v-card-text class="flex-grow-1 overflow-y-auto">
      <v-form ref="formRef" @submit.prevent="$emit('save')">
        <v-row dense>
          <!-- General Info Section -->
          <v-col cols="12">
            <v-text-field v-model="internalName" label="Name" :rules="[v => !!v || 'Name is required']" required />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="internalDescription" label="Description" rows="2" />
          </v-col>
          <v-col cols="6">
            <v-text-field v-model.number="internalPrice" label="Price ($)" type="number" prefix="$" />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model.number="internalDuration"
              label="Duration (mins)"
              type="number"
              suffix="min"
              :rules="[v => !!v || 'Duration is required', v => v > 0 || 'Must be > 0']"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-combobox
              v-model="internalCategory"
              :items="allCategories"
              label="Category"
              placeholder="e.g. Nails, Hair"
              hint="Select an existing category or type a new one"
              persistent-hint
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="internalAssignedIds"
              :items="providers"
              item-title="name"
              item-value="id"
              label="Assigned Specialists"
              multiple
              chips
              closable-chips
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="internalDefaultId"
              :items="assignedProvidersFull"
              item-title="name"
              item-value="id"
              label="Default Provider (Optional)"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>

          <!-- Availability Section -->
          <v-col cols="12">
            <v-divider class="mb-4"></v-divider>
            <div class="d-flex align-center mb-2">
              <div class="text-h6 font-weight-bold">Availability</div>
              <v-tooltip location="top" text="Define how customers can book this service. Standard uses a range, Fixed Slots uses specific manual entries.">
                <template #activator="{ props }">
                  <v-icon v-bind="props" icon="mdi-information-outline" size="small" color="grey" class="ml-2" />
                </template>
              </v-tooltip>
            </div>

            <!-- Availability Type Selection -->
            <v-radio-group v-model="internalMode" inline hide-details class="mb-4">
              <v-radio label="Standard (Range)" value="Standard" color="primary" />
              <v-radio label="Fixed Slots" value="Fixed Slots" color="primary" />
            </v-radio-group>

            <!-- Global Time window (Daily Booking Window) -->
            <div class="mb-4 pa-4 rounded-lg bg-surface-variant-light" :class="{'border-primary': internalMode === 'Standard'}">
              <div class="d-flex align-center mb-2">
                <div class="text-subtitle-2 font-weight-bold">Daily Booking Window</div>
                <v-tooltip location="top" text="This defines the potential hours available for booking each day. Even for Fixed Slots, entries will be hidden if they fall outside this window.">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" icon="mdi-information-outline" size="x-small" class="ml-2 opacity-70" />
                  </template>
                </v-tooltip>
              </div>
              <TimeRangeSlider
                :start="timeRangeStart"
                :end="timeRangeEnd"
                :date="dateRangeStart"
                @update:start="$emit('update:timeRangeStart', $event)"
                @update:end="$emit('update:timeRangeEnd', $event)"
              />
              <v-alert
                v-if="isRangeTodayPast"
                type="warning"
                variant="tonal"
                density="compact"
                class="mt-2"
                icon="mdi-clock-alert-outline"
              >
                Past hours for <strong>Today</strong> are automatically hidden.
              </v-alert>
            </div>

            <!-- Date Range Selection -->
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold">Start Date</div>
                <DateTimePicker :date="dateRangeStart" :time="null" hideTime scheduling-mode="Standard" @update:date="$emit('update:dateRangeStart', $event)" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold">End Date</div>
                <DateTimePicker :date="dateRangeEnd" :time="null" hideTime scheduling-mode="Standard" @update:date="$emit('update:dateRangeEnd', $event)" />
              </v-col>
              
              <v-col cols="12">
                <!-- Validation Alerts -->
                <v-alert
                  v-if="dateRangeStart && !dateRangeEnd"
                  type="error"
                  variant="tonal"
                  density="compact"
                  icon="mdi-calendar-alert"
                  class="mt-1"
                >
                  <strong>Incomplete Range:</strong> End Date is required if a Start Date is set.
                </v-alert>
                <v-alert
                  v-else-if="dateRangeEnd && !dateRangeStart"
                  type="error"
                  variant="tonal"
                  density="compact"
                  icon="mdi-calendar-alert"
                  class="mt-1"
                >
                  <strong>Incomplete Range:</strong> Start Date is required if an End Date is set.
                </v-alert>
                <v-alert
                  v-else-if="dateRangeStart && dateRangeEnd && dateRangeStart > dateRangeEnd"
                  type="error"
                  variant="tonal"
                  density="compact"
                  icon="mdi-calendar-alert"
                  class="mt-1"
                >
                  <strong>Invalid Range:</strong> Start Date cannot be after End Date.
                </v-alert>
                <v-alert
                  v-if="internalMode === 'Standard' && (!timeRangeStart || !timeRangeEnd || !dateRangeStart || !dateRangeEnd)"
                  type="info"
                  variant="tonal"
                  density="compact"
                  icon="mdi-information"
                  class="mt-1"
                >
                  Standard mode requires both <strong>Time Range</strong> and <strong>Date Range</strong> to be fully defined.
                </v-alert>
              </v-col>
            </v-row>
          </v-col>

          <!-- Mode-Specific Managers -->
          <v-col v-if="internalMode === 'Fixed Slots'" cols="12">
            <AdminSlotManager
              :slots="availableSlots"
              :new-date="newSlotDate"
              :new-time="newSlotTime"
              @add="$emit('add-slot')"
              @remove="$emit('remove-slot', $event)"
              @update:new-date="$emit('update:newSlotDate', $event)"
              @update:new-time="$emit('update:newSlotTime', $event)"
            />
            <v-alert
              v-if="isFixedTodayPast"
              type="warning"
              variant="tonal"
              density="compact"
              class="mt-2"
              icon="mdi-clock-alert-outline"
            >
              Passed <strong>Fixed Slots</strong> for today will not be visible to customers.
            </v-alert>
          </v-col>

          <!-- Specialist Overrides -->
          <v-col cols="12">
            <AdminOverrideManager
              v-if="assignedProvidersFull.length > 1"
              :editing-service-id="editingId"
              :selected-provider-id="selectedOverrideId"
              :scheduling-mode="overrideMode"
              :assigned-providers="assignedProvidersFull"
              :override-provider-name="overrideProviderName"
              :override-slots="overrideSlots"
              :over-date="overDate"
              :over-time="overTime"
              :over-date-range-start="overDateRangeStart"
              :over-date-range-end="overDateRangeEnd"
              :over-time-range-start="overTimeRangeStart"
              :over-time-range-end="overTimeRangeEnd"
              :provider-availability="providerAvailability"
              :duration="internalDuration"
              :is-valid="isOverrideValid"
              :get-provider-name="getProviderName"
              @update:selected-provider-id="$emit('update:selectedOverrideId', $event)"
              @update:scheduling-mode="$emit('update:overrideMode', $event)"
              @update:over-date="$emit('update:overDate', $event)"
              @update:over-time="$emit('update:overTime', $event)"
              @update:over-date-range-start="$emit('update:overDateRangeStart', $event)"
              @update:over-date-range-end="$emit('update:overDateRangeEnd', $event)"
              @update:over-time-range-start="$emit('update:overTimeRangeStart', $event)"
              @update:over-time-range-end="$emit('update:overTimeRangeEnd', $event)"
              @add-slot="$emit('add-override-slot')"
              @remove-slot="$emit('remove-override-slot', $event)"
              @save="$emit('save-override')"
              @edit-override="$emit('edit-override', $event)"
              @remove-override="$emit('remove-override', $event)"
            />
          </v-col>

          <!-- Visibility & Promotion Section -->
          <v-col cols="12">
            <v-divider class="my-4"></v-divider>
            <div class="text-h6 font-weight-bold mb-2">Visibility & Promotion</div>
            <v-card variant="outlined" class="pa-4 border-dashed">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="internalIsVisible"
                    label="Publicly Visible"
                    color="success"
                    hide-details
                    density="compact"
                    prepend-icon="mdi-eye-outline"
                  />
                  <div class="text-caption text-grey ml-10 mt-n1">Set if this service is visible to customers.</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="internalIsFeatured"
                    label="Featured Service"
                    color="amber"
                    hide-details
                    density="compact"
                    prepend-icon="mdi-star-outline"
                  />
                  <div class="text-caption text-grey ml-10 mt-n1">Highlight this service on the home page.</div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        
        <v-row class="mt-4">
          <v-col cols="6">
            <v-btn block color="primary" variant="elevated" type="submit" :disabled="!isValid">
              {{ editingId ? 'Update Service' : 'Add Service' }}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn block color="grey" variant="tonal" @click="$emit('cancel')">Cancel</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getTodayStr, parseTimeMin, formatTimeMin } from '@/utils/timeUtils'
import { useSettings } from '@/composables/useSettings'
import DateTimePicker from '@/components/DateTimePicker.vue'
import AdminSlotManager from './AdminSlotManager.vue'
import AdminOverrideManager from './AdminOverrideManager.vue'
import TimeRangeSlider from './TimeRangeSlider.vue'
import { useServicesStore } from '@/stores/services'
import type { AvailabilitySlot, AvailabilityOverride } from '@/stores/services'

const servicesStore = useServicesStore()
const allCategories = computed(() => {
  return [...new Set(servicesStore.services.map(s => s.category))].filter(Boolean)
})

// Minimal interface for VForm validation
type VForm = {
  validate: () => Promise<{ valid: boolean }>;
  reset: () => void;
  resetValidation: () => void;
}

const props = defineProps<{
  editingId: number | null;
  name: string;
  description: string;
  price: number | null;
  duration: number | null;
  category: string;
  mode: 'Standard' | 'Fixed Slots';
  assignedProviderIds: number[];
  defaultProviderId: number | null;
  providers: { id: number; name: string }[];
  availableSlots: AvailabilitySlot[];
  newSlotDate: string | null;
  newSlotTime: string | null;
  dateRangeStart: string | null;
  dateRangeEnd: string | null;
  timeRangeStart: string | null;
  timeRangeEnd: string | null;
  providerAvailability: { [id: number]: AvailabilityOverride };
  isVisible: boolean;
  isFeatured: boolean;
  isValid: boolean;
  
  // Override props
  selectedOverrideId: number | null;
  overrideMode: 'Standard' | 'Fixed Slots';
  overrideProviderName: string;
  overrideSlots: AvailabilitySlot[];
  overDate: string | null;
  overTime: string | null;
  overDateRangeStart: string | null;
  overDateRangeEnd: string | null;
  overTimeRangeStart: string | null;
  overTimeRangeEnd: string | null;
  isOverrideValid: boolean;
  getProviderName: (id: number) => string;
}>();

const emit = defineEmits([
  'update:name', 'update:description', 'update:price', 'update:duration', 'update:category',
  'update:mode', 'update:assignedProviderIds', 'update:defaultProviderId',
  'update:newSlotDate', 'update:newSlotTime', 'add-slot', 'remove-slot',
  'update:dateRangeStart', 'update:dateRangeEnd', 'update:timeRangeStart', 'update:timeRangeEnd',
  'update:isVisible', 'update:isFeatured',
  'save', 'cancel',
  
  // Override emits
  'update:selectedOverrideId', 'update:overrideMode',
  'update:overDate', 'update:overTime',
  'update:overDateRangeStart', 'update:overDateRangeEnd',
  'update:overTimeRangeStart', 'update:overTimeRangeEnd',
  'add-override-slot', 'remove-override-slot', 'save-override',
  'edit-override', 'remove-override'
]);

const { timeFormat } = useSettings();

const formRef = ref<VForm | null>(null);

// V-model wrappers
const internalName = computed({ get: () => props.name, set: v => emit('update:name', v) });
const internalDescription = computed({ get: () => props.description, set: v => emit('update:description', v) });
const internalPrice = computed({ get: () => props.price, set: v => emit('update:price', v) });
const internalDuration = computed({ get: () => props.duration, set: v => emit('update:duration', v) });
const internalCategory = computed({ get: () => props.category, set: v => emit('update:category', v) });
const internalMode = computed({ get: () => props.mode, set: v => emit('update:mode', v) });
const internalAssignedIds = computed({ get: () => props.assignedProviderIds, set: v => emit('update:assignedProviderIds', v) });
const internalDefaultId = computed({ get: () => props.defaultProviderId, set: v => emit('update:defaultProviderId', v) });
const internalIsVisible = computed({ get: () => props.isVisible, set: v => emit('update:isVisible', v) });
const internalIsFeatured = computed({ get: () => props.isFeatured, set: v => emit('update:isFeatured', v) });

const assignedProvidersFull = computed(() => {
  return props.providers.filter(p => props.assignedProviderIds.includes(p.id));
});

// Time Warnings Logic
const nowMin = computed(() => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
});

const currentFormatedTime = computed(() => formatTimeMin(nowMin.value, timeFormat.value as '12h'|'24h'));

const isRangeTodayPast = computed(() => {
  if (props.mode !== 'Standard' || !props.dateRangeStart || !props.timeRangeStart) return false;
  const today = getTodayStr();
  if (props.dateRangeStart === today) {
    return parseTimeMin(props.timeRangeStart) < nowMin.value;
  }
  return false;
});

const isFixedTodayPast = computed(() => {
  if (props.mode !== 'Fixed Slots' || !props.availableSlots) return false;
  const today = getTodayStr();
  return props.availableSlots.some(s => 
    s.date === today && s.times.some((t: string) => parseTimeMin(t) < nowMin.value)
  );
});

defineExpose({
  validate: () => formRef.value?.validate(),
  resetValidation: () => formRef.value?.resetValidation()
});
</script>

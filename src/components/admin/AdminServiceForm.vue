<template>
  <v-card>
    <v-card-title>{{ editingId ? 'Edit Service' : 'Add New Service' }}</v-card-title>
    <v-card-text>
      <v-form ref="formRef" @submit.prevent="$emit('save')">
        <v-row dense>
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
            <v-text-field v-model.number="internalDuration" label="Duration (mins)" type="number" suffix="min" />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="internalCategory" label="Category" placeholder="e.g. Nails, Hair" />
          </v-col>
          <v-col cols="12">
            <v-radio-group v-model="internalMode" label="Availability Type" inline>
              <v-radio label="Standard (Range)" value="Standard" />
              <v-radio label="Fixed Slots" value="Fixed Slots" />
            </v-radio-group>
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
          
          <!-- Mode: Fixed Slots -->
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
          </v-col>

          <!-- Mode: Standard -->
          <v-col v-if="internalMode === 'Standard'" cols="12">
            <div class="text-subtitle-2 mb-1">Range Availability (Optional)</div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="text-caption">Start Date</div>
                <DateTimePicker :date="dateRangeStart" :time="null" hideTime scheduling-mode="Standard" @update:date="$emit('update:dateRangeStart', $event)" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption">End Date</div>
                <DateTimePicker :date="dateRangeEnd" :time="null" hideTime scheduling-mode="Standard" @update:date="$emit('update:dateRangeEnd', $event)" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption">Start Time</div>
                <DateTimePicker :date="null" :time="timeRangeStart" hideDate :duration="internalDuration || undefined" :time-range="{ start: null, end: timeRangeEnd }" scheduling-mode="Standard" @update:time="$emit('update:timeRangeStart', $event)" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption">End Time</div>
                <DateTimePicker :date="null" :time="timeRangeEnd" hideDate :duration="internalDuration || undefined" :time-range="{ start: timeRangeStart, end: null }" scheduling-mode="Standard" @update:time="$emit('update:timeRangeEnd', $event)" />
              </v-col>
            </v-row>
          </v-col>
          
          <v-col cols="12">
            <AdminOverrideManager
              v-if="editingId"
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
import { ref, computed, watch } from 'vue'
import DateTimePicker from '@/components/DateTimePicker.vue'
import AdminSlotManager from './AdminSlotManager.vue'
import AdminOverrideManager from './AdminOverrideManager.vue'

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
  providers: any[];
  availableSlots: any[];
  newSlotDate: string | null;
  newSlotTime: string | null;
  dateRangeStart: string | null;
  dateRangeEnd: string | null;
  timeRangeStart: string | null;
  timeRangeEnd: string | null;
  providerAvailability: any;
  isValid: boolean;
  
  // Override props
  selectedOverrideId: number | null;
  overrideMode: 'Standard' | 'Fixed Slots';
  overrideProviderName: string;
  overrideSlots: any[];
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
  'save', 'cancel',
  
  // Override emits
  'update:selectedOverrideId', 'update:overrideMode',
  'update:overDate', 'update:overTime',
  'update:overDateRangeStart', 'update:overDateRangeEnd',
  'update:overTimeRangeStart', 'update:overTimeRangeEnd',
  'add-override-slot', 'remove-override-slot', 'save-override',
  'edit-override', 'remove-override'
]);

const formRef = ref<any>(null);

// V-model wrappers
const internalName = computed({ get: () => props.name, set: v => emit('update:name', v) });
const internalDescription = computed({ get: () => props.description, set: v => emit('update:description', v) });
const internalPrice = computed({ get: () => props.price, set: v => emit('update:price', v) });
const internalDuration = computed({ get: () => props.duration, set: v => emit('update:duration', v) });
const internalCategory = computed({ get: () => props.category, set: v => emit('update:category', v) });
const internalMode = computed({ get: () => props.mode, set: v => emit('update:mode', v) });
const internalAssignedIds = computed({ get: () => props.assignedProviderIds, set: v => emit('update:assignedProviderIds', v) });
const internalDefaultId = computed({ get: () => props.defaultProviderId, set: v => emit('update:defaultProviderId', v) });

const assignedProvidersFull = computed(() => {
  return props.providers.filter(p => props.assignedProviderIds.includes(p.id));
});

defineExpose({
  validate: () => formRef.value.validate(),
  resetValidation: () => formRef.value.resetValidation()
});
</script>

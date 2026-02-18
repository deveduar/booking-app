<template>
  <v-container class="py-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Admin Dashboard</h1>
      <v-chip color="primary" variant="elevated">System Online</v-chip>
    </div>

    <!-- Dashboard Metrics -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-card color="primary" theme="dark">
          <v-card-text class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-briefcase-outline</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ services.length }}</div>
              <div class="text-subtitle-1">Services</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="secondary" theme="dark">
          <v-card-text class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-account-group-outline</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ providers.length }}</div>
              <div class="text-subtitle-1">Providers</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="success" theme="dark">
          <v-card-text class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-calendar-check-outline</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ upcomingAppointments.length }}</div>
              <div class="text-subtitle-1">Upcoming Appointments</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Services</v-card-title>
          <v-card-text>
            <v-form ref="serviceForm" @submit.prevent="addService">
              <v-row dense>
                <v-col cols="12"><v-text-field v-model="svcName" label="Name" :rules="[v => !!v || 'Name is required']" required /></v-col>
                <v-col cols="12"><v-text-field v-model="svcDescription" label="Description" :rules="[v => !!v || 'Description is required']" /></v-col>
                <v-col cols="6"><v-text-field v-model.number="svcPrice" label="Price" type="number" :rules="[v => (v !== null && v !== undefined && v >= 0) || 'Price must be 0 or more']" /></v-col>
                <v-col cols="6"><v-text-field v-model.number="svcDuration" label="Duration (mins)" type="number" :rules="[v => (v !== null && v !== undefined && v > 0) || 'Duration must be greater than 0']" /></v-col>
                <v-col cols="12"><v-text-field v-model="svcCategory" label="Category" :rules="[v => !!v || 'Category is required']" /></v-col>
                
                <v-col cols="12">
                  <v-radio-group v-model="svcSchedulingMode" label="Scheduling Mode" inline>
                    <v-radio label="Standard (Range)" value="Standard"></v-radio>
                    <v-radio label="Fixed Slots" value="Fixed Slots"></v-radio>
                  </v-radio-group>
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="svcAssignedProviderIds"
                    :items="providers"
                    item-title="name"
                    item-value="id"
                    label="Assigned Specialists"
                    multiple
                    chips
                    closable-chips
                    variant="outlined"
                    density="compact"
                    :rules="[v => (v && v.length > 0) || 'Assign at least one specialist']"
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="svcDefaultProviderId"
                    :items="assignedProviders"
                    item-title="name"
                    item-value="id"
                    label="Default Provider (Optional)"
                    variant="outlined"
                    density="compact"
                    clearable
                  />
                </v-col>

                
                <v-col v-if="svcSchedulingMode === 'Fixed Slots'" cols="12">
                  <div class="text-subtitle-2 mb-1">Specific Availability (Unique Dates)</div>
                  <v-alert v-if="svcAvailableSlots.length === 0" type="info" density="compact" variant="tonal" class="mb-2">
                    No unique slots. Service will use default provider availability.
                  </v-alert>
                  <v-list v-else lines="one" density="compact">
                    <v-list-item v-for="(slot, index) in svcAvailableSlots" :key="index">
                      <v-list-item-title>{{ slot.date }} : {{ slot.times.join(', ') }}</v-list-item-title>
                      <template #append>
                        <v-btn icon="mdi-delete" size="x-small" variant="text" @click="removeSlot(index)" />
                      </template>
                    </v-list-item>
                  </v-list>
                  
                  <v-row dense class="align-center mt-1">
                    <v-col cols="12">
                      <DateTimePicker
                        :date="newSlotDate"
                        :time="newSlotTime"
                        @update:date="newSlotDate = $event"
                        @update:time="newSlotTime = $event"
                        :duration="svcDuration || undefined"
                      />
                    </v-col>
                    <v-col cols="12" class="d-flex justify-end">
                      <v-btn
                        prepend-icon="mdi-plus"
                        size="small"
                        color="secondary"
                        @click="addSlot"
                        :disabled="!newSlotDate || !newSlotTime"
                      >
                        Add Slot
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col v-if="svcSchedulingMode === 'Standard'" cols="12">
                  <div class="text-subtitle-2 mb-1">Range Availability (Optional)</div>
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <div class="text-caption">Start Date</div>
                      <DateTimePicker :date="svcDateRangeStart" :time="null" hideTime @update:date="svcDateRangeStart = $event" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="text-caption">End Date</div>
                      <DateTimePicker :date="svcDateRangeEnd" :time="null" hideTime @update:date="svcDateRangeEnd = $event" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="text-caption">Start Time</div>
                      <DateTimePicker :date="null" :time="svcTimeRangeStart" hideDate :duration="svcDuration || undefined" @update:time="svcTimeRangeStart = $event" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="text-caption">End Time</div>
                      <DateTimePicker :date="null" :time="svcTimeRangeEnd" hideDate :duration="svcDuration || undefined" @update:time="svcTimeRangeEnd = $event" />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col v-if="editingServiceId" cols="12">
                  <v-divider class="my-4"></v-divider>
                  <div class="text-h6 mb-2">Specialist Overrides (Advanced)</div>
                  <v-alert type="info" variant="tonal" density="compact" class="mb-4">
                    Set specific availability for a specialist that differs from the service defaults.
                  </v-alert>

                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="selectedOverrideProviderId"
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

                  <div v-if="selectedOverrideProviderId" class="pa-4 bg-surface-variant rounded-lg border">
                    <div class="text-subtitle-2 mb-2">Override for {{ overrideProviderName }}</div>
                    
                    <v-radio-group v-model="overrideSchedulingMode" label="Override Mode" inline>
                      <v-radio label="Standard (Range)" value="Standard"></v-radio>
                      <v-radio label="Fixed Slots" value="Fixed Slots"></v-radio>
                    </v-radio-group>

                    <div v-if="overrideSchedulingMode === 'Fixed Slots'">
                       <div class="text-caption mb-1">Specific Slots for Specialist</div>
                       <!-- Slot management for override -->
                       <v-list density="compact" bg-color="transparent" v-if="overrideSlots.length > 0">
                         <v-list-item v-for="(slot, idx) in overrideSlots" :key="idx">
                           {{ slot.date }}: {{ slot.times.join(', ') }}
                           <template #append>
                             <v-btn icon="mdi-delete" size="x-small" variant="text" @click="overrideSlots.splice(idx, 1)" />
                           </template>
                         </v-list-item>
                       </v-list>
                       <v-row dense class="align-center mt-1">
                        <v-col cols="12">
                          <DateTimePicker
                            :date="overDate"
                            :time="overTime"
                            @update:date="overDate = $event"
                            @update:time="overTime = $event"
                          />
                        </v-col>
                        <v-col cols="12" class="d-flex justify-end">
                          <v-btn prepend-icon="mdi-plus" size="small" variant="tonal" @click="addOverrideSlot" :disabled="!overDate || !overTime">Add Slot</v-btn>
                        </v-col>
                      </v-row>
                    </div>

                    <div v-if="overrideSchedulingMode === 'Standard'">
                      <v-row dense>
                        <v-col cols="12" sm="6"><div class="text-caption">Start Date</div><DateTimePicker :date="overDateRangeStart" :time="null" hideTime @update:date="overDateRangeStart = $event" /></v-col>
                        <v-col cols="12" sm="6"><div class="text-caption">End Date</div><DateTimePicker :date="overDateRangeEnd" :time="null" hideTime @update:date="overDateRangeEnd = $event" /></v-col>
                      </v-row>
                    </div>

                    <v-btn color="primary" variant="elevated" block class="mt-4" @click="saveOverride">
                      Save Specialist Override
                    </v-btn>
                  </div>

                  <!-- List of active overrides -->
                  <div v-if="Object.keys(svcProviderAvailability).length > 0" class="mt-4">
                    <div class="text-subtitle-2 mb-2">Active Specialist Overrides:</div>
                    <v-list density="compact" rounded-lg>
                      <v-list-item v-for="(ov, pid) in svcProviderAvailability" :key="pid">
                        <template #prepend>
                          <v-icon icon="mdi-account-star" color="primary" class="mr-2" />
                        </template>
                        <v-list-item-title>{{ getProviderName(Number(pid)) }}</v-list-item-title>
                        <v-list-item-subtitle>
                          <v-chip size="x-small" label color="primary" variant="flat" class="mr-1">{{ ov.schedulingMode }}</v-chip>
                          <span v-if="ov.schedulingMode === 'Standard'">
                            {{ ov.dateRange?.start }} — {{ ov.dateRange?.end }}
                          </span>
                          <span v-else>
                            {{ ov.availableSlots?.map(s => s.date).slice(0, 2).join(', ') }}
                            <span v-if="ov.availableSlots && ov.availableSlots.length > 2">... (+{{ ov.availableSlots.length - 2 }} more)</span>
                          </span>
                        </v-list-item-subtitle>
                        <template #append>
                          <v-btn icon="mdi-pencil" size="x-small" variant="text" @click="editOverride(Number(pid), ov)" class="mr-1" />
                          <v-btn icon="mdi-delete" size="x-small" variant="text" @click="delete svcProviderAvailability[Number(pid)]" />
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-col>
               </v-row>
              <v-btn type="submit" color="primary" class="mt-2" block>
                {{ editingServiceId ? 'Save Changes' : 'Add Service' }}
              </v-btn>
              <v-btn v-if="editingServiceId" color="grey" variant="text" class="mt-1" block @click="cancelEdit">
                Cancel
              </v-btn>
            </v-form>
            <v-list class="mt-4">
              <v-list-item v-for="s in services" :key="s.id">
                <v-list-item-title>{{ s.name }} · {{ s.category }}</v-list-item-title>
                <v-list-item-subtitle>
                  ${{ (Number(s.price) || 0).toFixed(2) }} · {{ Number(s.duration) || 0 }} mins
                </v-list-item-subtitle>
                 <template #append>
                  <v-btn icon="mdi-pencil" variant="text" @click="editService(s)" />
                  <v-btn icon="mdi-delete" variant="text" @click="removeService(s.id)" />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Providers</v-card-title>
          <v-card-text>
            <v-form ref="providerForm" @submit.prevent="addProvider">
              <v-text-field v-model="provName" label="Name" :rules="[v => !!v || 'Name is required']" required />
              <v-text-field v-model="provStatus" label="Status" :rules="[v => !!v || 'Status is required']" />
              <v-text-field v-model="provImage" label="Image URL (Experimental)" :rules="[v => !v || /^https?:\/\/.+/.test(v) || 'Must be a valid URL']" />
              <v-btn type="submit" color="primary" class="mt-2" block>Add Provider</v-btn>
            </v-form>
            <v-list class="mt-4">
              <v-list-item v-for="p in providers" :key="p.id">
                <template #prepend>
                  <v-avatar><v-img :src="p.image" /></v-avatar>
                </template>
                <v-list-item-title>{{ p.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ p.status }} · {{ p.serviceIds.length }} services</v-list-item-subtitle>
                <template #append>
                  <v-btn icon="mdi-delete" variant="text" @click="removeProvider(p.id)" />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Relational Management Section -->
    <v-row v-if="providers.length > 0 && services.length > 0">
      <v-col cols="12">
        <v-card>
          <v-card-title>Manage Provider Services</v-card-title>
          <v-card-text>
            <v-row v-for="p in providers" :key="p.id" class="align-center border-bottom py-2">
              <v-col cols="12" sm="3" class="font-weight-bold">
                {{ p.name }}
              </v-col>
              <v-col cols="12" sm="9">
                <v-select
                  v-model="p.serviceIds"
                  :items="services"
                  item-title="name"
                  item-value="id"
                  label="Assigned Services"
                  multiple
                  chips
                  closable-chips
                  density="compact"
                  variant="outlined"
                  hide-details
                >
                  <template #chip="{ props: chipProps, item }">
                    <v-chip
                      v-bind="chipProps"
                      :color="item.raw.defaultProviderId === p.id ? 'primary' : ''"
                      :prepend-icon="item.raw.defaultProviderId === p.id ? 'mdi-star' : ''"
                      size="small"
                    >
                      {{ item.title }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-snackbar
    v-model="snackbar"
    :timeout="3000"
    :color="snackbarColor"
    elevation="24"
  >
    {{ snackbarText }}
    <template #actions>
      <v-btn variant="text" @click="snackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useServicesStore, type AvailabilityOverride } from '@/stores/services'
import { useProvidersStore } from '@/stores/providers'
import { useAppointmentsStore } from '@/stores/appointments'
import DateTimePicker from '@/components/DateTimePicker.vue'

const servicesStore = useServicesStore()
const { services } = storeToRefs(servicesStore)

const providersStore = useProvidersStore()
const { providers } = storeToRefs(providersStore)

const appointmentsStore = useAppointmentsStore()
const { upcoming: upcomingAppointments } = storeToRefs(appointmentsStore)

const svcName = ref('')
const svcDescription = ref('')
const svcPrice = ref<number | null>(null)
const svcDuration = ref<number | null>(null)
const svcCategory = ref('')
const svcSchedulingMode = ref<'Standard' | 'Fixed Slots'>('Standard')
const svcDefaultProviderId = ref<number | null>(null)
const svcAssignedProviderIds = ref<number[]>([])
const svcAvailableSlots = ref<{ date: string, times: string[] }[]>([])

const now = new Date()
const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

const svcDateRangeStart = ref<string | null>(null)
const svcDateRangeEnd = ref<string | null>(null)
const svcTimeRangeStart = ref<string | null>(null)
const svcTimeRangeEnd = ref<string | null>(null)
const svcProviderAvailability = ref<{ [id: number]: AvailabilityOverride }>({})

// Override state
const selectedOverrideProviderId = ref<number | null>(null)
const overrideSchedulingMode = ref<'Standard' | 'Fixed Slots'>('Standard')
const overrideSlots = ref<{ date: string, times: string[] }[]>([])
const overDate = ref<string | null>(null)
const overTime = ref<string | null>(null)
const overDateRangeStart = ref<string | null>(null)
const overDateRangeEnd = ref<string | null>(null)

const assignedProviders = computed(() => {
  return providers.value.filter(p => svcAssignedProviderIds.value.includes(p.id))
})

const overrideProviderName = computed(() => {
  return providers.value.find(p => p.id === selectedOverrideProviderId.value)?.name || ''
})

function getProviderName(id: number) {
  return providers.value.find(p => p.id === id)?.name || 'Unknown'
}

function addOverrideSlot() {
  if (!overDate.value || !overTime.value) return
  const existing = overrideSlots.value.find(s => s.date === overDate.value)
  if (existing) {
    if (!existing.times.includes(overTime.value)) existing.times.push(overTime.value)
  } else {
    overrideSlots.value.push({ date: overDate.value, times: [overTime.value] })
  }
  overTime.value = null
}

function saveOverride() {
  if (!selectedOverrideProviderId.value) return
  svcProviderAvailability.value[selectedOverrideProviderId.value] = {
    schedulingMode: overrideSchedulingMode.value,
    availableSlots: JSON.parse(JSON.stringify(overrideSlots.value)),
    dateRange: { start: overDateRangeStart.value, end: overDateRangeEnd.value }
  }
  selectedOverrideProviderId.value = null
  snackbarText.value = 'Override saved (apply changes to save permanently)'
  snackbarColor.value = 'info'
  snackbar.value = true
}

// Watch for override provider selection to load data
watch(selectedOverrideProviderId, (id) => {
  if (id && svcProviderAvailability.value[id]) {
    const ov = svcProviderAvailability.value[id]
    overrideSchedulingMode.value = ov.schedulingMode || 'Standard'
    overrideSlots.value = JSON.parse(JSON.stringify(ov.availableSlots || []))
    overDateRangeStart.value = ov.dateRange?.start || null
    overDateRangeEnd.value = ov.dateRange?.end || null
  }
})

function editOverride(pid: number, ov: AvailabilityOverride) {
  selectedOverrideProviderId.value = pid
  // The watcher on selectedOverrideProviderId will handle loading the data
}

const newSlotDate = ref<string | null>(null)
const newSlotTime = ref<string | null>(null)

function addSlot() {
  if (!newSlotDate.value || !newSlotTime.value) return
  const existing = svcAvailableSlots.value.find(s => s.date === newSlotDate.value)
  if (existing) {
    if (!existing.times.includes(newSlotTime.value)) {
      existing.times.push(newSlotTime.value)
    }
  } else {
    svcAvailableSlots.value.push({ date: newSlotDate.value, times: [newSlotTime.value] })
  }
  newSlotDate.value = null
  newSlotTime.value = null
}

function removeSlot(index: number) {
  svcAvailableSlots.value.splice(index, 1)
}

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const editingServiceId = ref<number | null>(null)
const serviceForm = ref<any>(null)
const providerForm = ref<any>(null)

function editService(service: any) {
  editingServiceId.value = service.id
  svcName.value = service.name
  svcDescription.value = service.description
  svcPrice.value = service.price
  svcDuration.value = service.duration
  svcCategory.value = service.category
  svcSchedulingMode.value = service.schedulingMode || 'Standard'
  svcDefaultProviderId.value = service.defaultProviderId || null
  svcAssignedProviderIds.value = providers.value
    .filter(p => p.serviceIds.includes(service.id))
    .map(p => p.id)
  svcAvailableSlots.value = service.availableSlots ? JSON.parse(JSON.stringify(service.availableSlots)) : []
  svcDateRangeStart.value = service.dateRange?.start || null
  svcDateRangeEnd.value = service.dateRange?.end || null
  svcTimeRangeStart.value = service.timeRange?.start || null
  svcTimeRangeEnd.value = service.timeRange?.end || null
  svcProviderAvailability.value = service.providerAvailability ? JSON.parse(JSON.stringify(service.providerAvailability)) : {}
}

function cancelEdit() {
  editingServiceId.value = null
  svcName.value = ''
  svcDescription.value = ''
  svcPrice.value = null
  svcDuration.value = null
  svcCategory.value = ''
  svcSchedulingMode.value = 'Standard'
  svcDefaultProviderId.value = null
  svcAssignedProviderIds.value = []
  svcAvailableSlots.value = []
  svcDateRangeStart.value = null
  svcDateRangeEnd.value = null
  svcTimeRangeStart.value = null
  svcTimeRangeEnd.value = null
  svcProviderAvailability.value = {}
  selectedOverrideProviderId.value = null
  nextTick(() => {
    if (serviceForm.value) serviceForm.value.resetValidation()
  })
}

async function addService() {
  const { valid } = await serviceForm.value.validate()
  if (!valid) return
  
  const serviceData = {
    name: svcName.value,
    description: svcDescription.value || '',
    price: Number(svcPrice.value ?? 0),
    duration: Number(svcDuration.value ?? 0),
    category: svcCategory.value || 'General',
    schedulingMode: svcSchedulingMode.value,
    defaultProviderId: svcDefaultProviderId.value || undefined,
    availableSlots: svcAvailableSlots.value,
    dateRange: { start: svcDateRangeStart.value, end: svcDateRangeEnd.value },
    timeRange: { start: svcTimeRangeStart.value, end: svcTimeRangeEnd.value },
    providerAvailability: svcProviderAvailability.value,
  }

  if (editingServiceId.value) {
    servicesStore.updateService(editingServiceId.value, serviceData)
    providersStore.toggleServiceAssignment(editingServiceId.value, svcAssignedProviderIds.value)
    if (serviceData.defaultProviderId) {
      providersStore.assignService(serviceData.defaultProviderId, editingServiceId.value)
    }
    snackbarText.value = 'Service updated successfully!'
  } else {
    // We need the ID of the new service to assign it to provider
    servicesStore.addService(serviceData)
    const newService = services.value[services.value.length - 1]
    if (newService) {
      providersStore.toggleServiceAssignment(newService.id, svcAssignedProviderIds.value)
      if (serviceData.defaultProviderId) {
        providersStore.assignService(serviceData.defaultProviderId, newService.id)
      }
    }
    snackbarText.value = 'Service added successfully!'
  }
  
  snackbarColor.value = 'success'
  snackbar.value = true
  cancelEdit()
}

function removeService(id: number) {
  servicesStore.removeService(id)
}

const provName = ref('')
const provStatus = ref('Available')
const provImage = ref('')

async function addProvider() {
  const { valid } = await providerForm.value.validate()
  if (!valid) return
  providersStore.addProvider({
    name: provName.value,
    status: provStatus.value || 'Available',
    image: provImage.value || '',
    serviceIds: [],
  })
  provName.value = ''
  provStatus.value = 'Available'
  provImage.value = ''
  nextTick(() => {
    if (providerForm.value) providerForm.value.resetValidation()
  })
}

function removeProvider(id: number) {
  providersStore.removeProvider(id)
}
</script>


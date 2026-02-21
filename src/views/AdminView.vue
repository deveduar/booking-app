<template>
  <v-container class="py-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Admin Dashboard</h1>
      <v-chip color="primary" variant="elevated">System Online</v-chip>
    </div>

    <!-- Dashboard Metrics -->
    <AdminMetrics
      :service-count="services.length"
      :provider-count="providers.length"
      :appointment-count="upcomingAppointments.length"
    />

    <v-row>
      <!-- Service Management -->
      <v-col cols="12" md="6">
        <AdminServiceForm
          ref="serviceForm"
          v-bind="serviceEditorState"
          :editing-id="editingServiceId"
          :providers="providers"
          :get-provider-name="getProviderName"
          @update:name="svcName = $event"
          @update:description="svcDescription = $event"
          @update:price="svcPrice = $event"
          @update:duration="svcDuration = $event"
          @update:category="svcCategory = $event"
          @update:mode="svcSchedulingMode = $event"
          @update:assignedProviderIds="svcAssignedProviderIds = $event"
          @update:defaultProviderId="svcDefaultProviderId = $event"
          @update:newSlotDate="newSlotDate = $event"
          @update:newSlotTime="newSlotTime = $event"
          @update:dateRangeStart="svcDateRangeStart = $event"
          @update:dateRangeEnd="svcDateRangeEnd = $event"
          @update:timeRangeStart="svcTimeRangeStart = $event"
          @update:timeRangeEnd="svcTimeRangeEnd = $event"
          @add-slot="addSlot"
          @remove-slot="removeSlot"
          @save="handleSaveService"
          @cancel="cancelEdit"
          
          @update:selectedOverrideId="selectedOverrideProviderId = $event"
          @update:overrideMode="overrideSchedulingMode = $event"
          @update:overDate="overDate = $event"
          @update:overTime="overTime = $event"
          @update:overDateRangeStart="overDateRangeStart = $event"
          @update:overDateRangeEnd="overDateRangeEnd = $event"
          @update:overTimeRangeStart="overTimeRangeStart = $event"
          @update:overTimeRangeEnd="overTimeRangeEnd = $event"
          @add-override-slot="addOverrideSlot"
          @remove-override-slot="removeOverrideSlot"
          @save-override="saveOverride"
          @edit-override="editOverride"
          @remove-override="removeOverride"
        />

        <AdminServiceList
          :services="services"
          @edit="editService"
          @delete="removeService"
        />
      </v-col>

      <!-- Specialists Management -->
      <v-col cols="12" md="6">
        <AdminProviderForm
          ref="providerForm"
          v-model:name="provName"
          v-model:description="provDescription"
          v-model:status="provStatus"
          v-model:image="provImage"
          :providers="providers"
          :editing-id="editingProviderId"
          @save="handleSaveProvider"
          @cancel="cancelProviderEdit"
          @remove="removeProvider"
          @edit="editProvider"
        />
      </v-col>
    </v-row>

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
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useServicesStore } from '@/stores/services'
import { useProvidersStore } from '@/stores/providers'
import { useAppointmentsStore } from '@/stores/appointments'

// Components
import AdminMetrics from '@/components/admin/AdminMetrics.vue'
import AdminServiceList from '@/components/admin/AdminServiceList.vue'
import AdminServiceForm from '@/components/admin/AdminServiceForm.vue'
import AdminProviderForm from '@/components/admin/AdminProviderForm.vue'

// Composables
import { useAdminServiceEditor } from '@/composables/useAdminServiceEditor'
import { useAdminProviderEditor } from '@/composables/useAdminProviderEditor'

const servicesStore = useServicesStore()
const { services } = storeToRefs(servicesStore)

const providersStore = useProvidersStore()
const { providers } = storeToRefs(providersStore)

const appointmentsStore = useAppointmentsStore()
const { upcoming: upcomingAppointments } = storeToRefs(appointmentsStore)

const {
  svcName, svcDescription, svcPrice, svcDuration, svcCategory,
  svcSchedulingMode, svcDefaultProviderId, svcAssignedProviderIds,
  svcAvailableSlots, svcDateRangeStart, svcDateRangeEnd,
  svcTimeRangeStart, svcTimeRangeEnd, svcProviderAvailability,
  editingServiceId, serviceForm,
  selectedOverrideProviderId, overrideSchedulingMode, overrideSlots,
  overDate, overTime, overDateRangeStart, overDateRangeEnd,
  overTimeRangeStart, overTimeRangeEnd,
  newSlotDate, newSlotTime,
  isSvcFormValid, isOverrideFormValid, overrideProviderName,
  editService, cancelEdit, saveService,
  addOverrideSlot, saveOverride, editOverride,
  addSlot, removeSlot
} = useAdminServiceEditor()

const {
  provName, provDescription, provStatus, provImage,
  editingProviderId, providerForm,
  editProvider, cancelProviderEdit, saveProvider,
  removeProvider: removeProviderFromStore
} = useAdminProviderEditor()

// Local UI state
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Proxying state for v-bind
const serviceEditorState = computed(() => ({
  name: svcName.value,
  description: svcDescription.value,
  price: svcPrice.value,
  duration: svcDuration.value,
  category: svcCategory.value,
  mode: svcSchedulingMode.value,
  assignedProviderIds: svcAssignedProviderIds.value,
  defaultProviderId: svcDefaultProviderId.value,
  availableSlots: svcAvailableSlots.value,
  newSlotDate: newSlotDate.value,
  newSlotTime: newSlotTime.value,
  dateRangeStart: svcDateRangeStart.value,
  dateRangeEnd: svcDateRangeEnd.value,
  timeRangeStart: svcTimeRangeStart.value,
  timeRangeEnd: svcTimeRangeEnd.value,
  providerAvailability: svcProviderAvailability.value,
  isValid: isSvcFormValid.value,

  // Override props
  selectedOverrideId: selectedOverrideProviderId.value,
  overrideMode: overrideSchedulingMode.value,
  overrideProviderName: overrideProviderName.value,
  overrideSlots: overrideSlots.value,
  overDate: overDate.value,
  overTime: overTime.value,
  overDateRangeStart: overDateRangeStart.value,
  overDateRangeEnd: overDateRangeEnd.value,
  overTimeRangeStart: overTimeRangeStart.value,
  overTimeRangeEnd: overTimeRangeEnd.value,
  isOverrideValid: isOverrideFormValid.value
}));

function getProviderName(id: number) {
  return providers.value.find(p => p.id === id)?.name || 'Unknown'
}

function removeOverride(pid: number) {
  delete svcProviderAvailability.value[pid]
}

function removeOverrideSlot(index: number) {
  overrideSlots.value.splice(index, 1)
}

async function handleSaveService() {
  const result = await saveService()
  if (result.success) {
    snackbarText.value = result.mode === 'update' ? 'Service updated successfully!' : 'Service added successfully!'
    snackbarColor.value = 'success'
    snackbar.value = true
  }
}

function removeService(id: number) {
  servicesStore.removeService(id)
  snackbarText.value = 'Service removed'
  snackbarColor.value = 'info'
  snackbar.value = true
}

async function handleSaveProvider() {
  const result = await saveProvider()
  if (result.success) {
    snackbarText.value = result.mode === 'update' ? 'Specialist updated successfully!' : 'Specialist added successfully!'
    snackbarColor.value = 'success'
    snackbar.value = true
  }
}

function removeProvider(id: number) {
  removeProviderFromStore(id)
  snackbarText.value = 'Specialist removed'
  snackbarColor.value = 'info'
  snackbar.value = true
}
</script>

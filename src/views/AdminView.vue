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
        <div id="specialist-form-anchor"></div>
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
          @remove="handleRemoveProviderClick"
          @edit="handleEditProviderClick"
        />
      </v-col>
    </v-row>

    <ProviderDeleteDialog
      v-model="deleteDialogOpen"
      :provider-name="providerToDeleteName"
      :conflicts="deleteConflicts"
      @confirm="confirmDeleteProvider"
    />

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
import ProviderDeleteDialog from '@/components/admin/ProviderDeleteDialog.vue'

// Composables
import { useAdminServiceEditor } from '@/composables/useAdminServiceEditor'
import { useAdminProviderEditor } from '@/composables/useAdminProviderEditor'
import type { Provider } from '@/stores/providers'

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

// Dialog State
const deleteDialogOpen = ref(false)
const providerToDeleteId = ref<number | null>(null)
const providerToDeleteName = ref('')
const deleteConflicts = ref<{ serviceId: number; serviceName: string; survivorId: number; survivorName: string }[]>([])

function handleEditProviderClick(provider: Provider) {
  editProvider(provider)
  const element = document.getElementById('specialist-form-anchor')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

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

function confirmDeleteProvider(action: 'remove' | 'promote') {
  if (!providerToDeleteId.value) return

  // Handle conflicts first
  if (deleteConflicts.value.length > 0) {
    deleteConflicts.value.forEach(c => {
      const service = servicesStore.getById(c.serviceId)
      if (!service) return

      if (action === 'promote') {
        servicesStore.promoteOverrideToGlobal(c.serviceId, c.survivorId)
      } else {
        // Just remove the override
        if (service.providerAvailability && service.providerAvailability[c.survivorId]) {
           delete service.providerAvailability[c.survivorId]
           servicesStore.updateService(c.serviceId, {})
        }
      }

      // Sync form if currently editing this service
      if (editingServiceId.value === c.serviceId) {
        const updatedService = servicesStore.getById(c.serviceId)
        if (updatedService) {
          if (action === 'promote') {
             svcSchedulingMode.value = updatedService.schedulingMode || 'Standard'
             svcAvailableSlots.value = updatedService.availableSlots ? JSON.parse(JSON.stringify(updatedService.availableSlots)) : []
             svcDateRangeStart.value = updatedService.dateRange?.start || null
             svcDateRangeEnd.value = updatedService.dateRange?.end || null
             svcTimeRangeStart.value = updatedService.timeRange?.start || null
             svcTimeRangeEnd.value = updatedService.timeRange?.end || null
          }
          // Always sync providerAvailability to reflect removed override
          svcProviderAvailability.value = updatedService.providerAvailability ? JSON.parse(JSON.stringify(updatedService.providerAvailability)) : {}
        }
      }
    })
  }

  // Then delete the provider
  removeProviderFromStore(providerToDeleteId.value)
  
  snackbarText.value = 'Specialist removed successfully'
  snackbarColor.value = 'info'
  snackbar.value = true
  
  // Reset
  providerToDeleteId.value = null
  providerToDeleteName.value = ''
  deleteConflicts.value = []
}

function handleRemoveProviderClick(id: number) {
  const provider = providers.value.find(p => p.id === id)
  if (!provider) return

  providerToDeleteId.value = id
  providerToDeleteName.value = provider.name
  deleteConflicts.value = []

  // Analyze conflicts
  // A conflict exists if:
  // 1. The service includes this provider
  // 2. After removal, only 1 provider remains
  // 3. That remaining provider has an override
  services.value.forEach(s => {
    if (s.providerAvailability) {
      const assignedIds = providersStore.getByService(s.id).map(p => p.id)
      if (assignedIds.includes(id)) {
        const remainingIds = assignedIds.filter(pid => pid !== id)
        if (remainingIds.length === 1) {
          const survivorId = remainingIds[0]
          if (s.providerAvailability[survivorId]) {
            const survivor = providers.value.find(p => p.id === survivorId)
            deleteConflicts.value.push({
              serviceId: s.id,
              serviceName: s.name,
              survivorId: survivorId,
              survivorName: survivor?.name || 'Unknown'
            })
          }
        }
      }
    }
  })

  deleteDialogOpen.value = true
}
</script>

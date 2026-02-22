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
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="text-h6">Services</div>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="handleAddServiceClick">
            Add Service
          </v-btn>
        </div>

        <AdminServiceList
          :services="services"
          :providers="providers"
          @edit="handleEditServiceClick"
          @delete="removeService"
        />

        <v-dialog v-model="serviceDialogOpen" max-width="800px" persistent>
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
            @cancel="handleCancelService"
            
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
        </v-dialog>
      </v-col>

      <!-- Specialists Management -->
      <v-col cols="12" class="mt-4">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="text-h6">Specialists</div>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="handleAddProviderClick">
            Add Specialist
          </v-btn>
        </div>

        <AdminProviderList
          :providers="providers"
          @edit="handleEditProviderClick"
          @remove="handleRemoveProviderClick"
        />

        <v-dialog v-model="providerDialogOpen" max-width="600px" persistent>
          <AdminProviderForm
            ref="providerForm"
            v-model:name="provName"
            v-model:description="provDescription"
            v-model:status="provStatus"
            v-model:image="provImage"
            :providers="providers"
            :editing-id="editingProviderId"
            @save="handleSaveProvider"
            @cancel="handleCancelProvider"
            @remove="handleRemoveProviderClick"
            @edit="handleEditProviderClick"
          />
        </v-dialog>
      </v-col>
    </v-row>

    <ProviderDeleteDialog
      v-model="deleteDialogOpen"
      :provider-name="providerToDeleteName"
      :conflicts="deleteConflicts"
      @confirm="confirmDeleteProvider"
    />

    <!-- Service Delete Dialog -->
    <v-dialog v-model="deleteServiceDialogOpen" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Delete Service?</v-card-title>
        <v-card-text>
          Are you sure you want to delete this service? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteServiceDialogOpen = false">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="confirmDeleteService">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import AdminProviderList from '@/components/admin/AdminProviderList.vue'
import ProviderDeleteDialog from '@/components/admin/ProviderDeleteDialog.vue'

// Composables
import { useAdminServiceEditor } from '@/composables/useAdminServiceEditor'
import { useAdminProviderEditor } from '@/composables/useAdminProviderEditor'
import type { Provider } from '@/stores/providers'
import type { Service } from '@/stores/services'

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
const serviceDialogOpen = ref(false)
const providerDialogOpen = ref(false)
const deleteDialogOpen = ref(false)

function handleAddServiceClick() {
  cancelEdit()
  serviceDialogOpen.value = true
}

function handleEditServiceClick(service: Service) {
  editService(service)
  serviceDialogOpen.value = true
}

function handleCancelService() {
  cancelEdit()
  serviceDialogOpen.value = false
}

async function handleSaveService() {
  const result = await saveService()
  if (result.success) {
    snackbarText.value = result.mode === 'update' ? 'Service updated successfully!' : 'Service added successfully!'
    snackbarColor.value = 'success'
    snackbar.value = true
    serviceDialogOpen.value = false
  }
}

function handleAddProviderClick() {
  cancelProviderEdit()
  providerDialogOpen.value = true
}

function handleEditProviderClick(provider: Provider) {
  editProvider(provider)
  providerDialogOpen.value = true
}

function handleCancelProvider() {
  cancelProviderEdit()
  providerDialogOpen.value = false
}

async function handleSaveProvider() {
  const result = await saveProvider()
  if (result.success) {
    snackbarText.value = result.mode === 'update' ? 'Specialist updated successfully!' : 'Specialist added successfully!'
    snackbarColor.value = 'success'
    snackbar.value = true
    providerDialogOpen.value = false
  }
}

const providerToDeleteId = ref<number | null>(null)
const providerToDeleteName = ref('')
const deleteConflicts = ref<{ serviceId: number; serviceName: string; survivorId: number; survivorName: string }[]>([])

// Service Delete Dialog State
const deleteServiceDialogOpen = ref(false)
const serviceToDeleteId = ref<number | null>(null)

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

function removeService(id: number) {
  serviceToDeleteId.value = id
  deleteServiceDialogOpen.value = true
}

function confirmDeleteService() {
  if (serviceToDeleteId.value) {
    servicesStore.removeService(serviceToDeleteId.value)
    snackbarText.value = 'Service removed successfully'
    snackbarColor.value = 'info'
    snackbar.value = true
    serviceToDeleteId.value = null
  }
  deleteServiceDialogOpen.value = false
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

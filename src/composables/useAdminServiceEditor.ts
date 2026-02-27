import { ref, computed, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useServicesStore, type AvailabilityOverride, type Service } from '@/stores/services'
import { useProvidersStore } from '@/stores/providers'
// import { isTimeRangeValid } from '@/utils/timeUtils'

export function useAdminServiceEditor() {
    const servicesStore = useServicesStore()
    const { services } = storeToRefs(servicesStore)
    const providersStore = useProvidersStore()
    const { providers } = storeToRefs(providersStore)

    // Service State
    const svcName = ref('')
    const svcDescription = ref('')
    const svcPrice = ref<number | null>(null)
    const svcDuration = ref<number | null>(null)
    const svcCategory = ref('')
    const svcSchedulingMode = ref<'Standard' | 'Fixed Slots'>('Standard')
    const svcDefaultProviderId = ref<number | null>(null)
    const svcAssignedProviderIds = ref<number[]>([])
    const svcAvailableSlots = ref<{ date: string, times: string[] }[]>([])
    const svcDateRangeStart = ref<string | null>(null)
    const svcDateRangeEnd = ref<string | null>(null)
    const svcTimeRangeStart = ref<string | null>(null)
    const svcTimeRangeEnd = ref<string | null>(null)
    const svcProviderAvailability = ref<{ [id: number]: AvailabilityOverride }>({})
    const svcIsFeatured = ref(false)
    const svcIsVisible = ref(true)
    const svcImageUrl = ref('')
    const svcThumbnailUrl = ref('')

    // Override State
    const selectedOverrideProviderId = ref<number | null>(null)
    const overrideSchedulingMode = ref<'Standard' | 'Fixed Slots'>('Standard')
    const overrideSlots = ref<{ date: string, times: string[] }[]>([])
    const overDate = ref<string | null>(null)
    const overTime = ref<string | null>(null)
    const overDateRangeStart = ref<string | null>(null)
    const overDateRangeEnd = ref<string | null>(null)
    const overTimeRangeStart = ref<string | null>(null)
    const overTimeRangeEnd = ref<string | null>(null)

    // Dirty Tracking
    const initialServiceSnapshot = ref('')

    function takeServiceSnapshot() {
        initialServiceSnapshot.value = JSON.stringify({
            name: svcName.value,
            description: svcDescription.value,
            price: svcPrice.value,
            duration: svcDuration.value,
            category: svcCategory.value,
            schedulingMode: svcSchedulingMode.value,
            defaultProviderId: svcDefaultProviderId.value,
            assignedProviderIds: svcAssignedProviderIds.value,
            availableSlots: svcAvailableSlots.value,
            dateRangeStart: svcDateRangeStart.value,
            dateRangeEnd: svcDateRangeEnd.value,
            timeRangeStart: svcTimeRangeStart.value,
            timeRangeEnd: svcTimeRangeEnd.value,
            providerAvailability: svcProviderAvailability.value,
            isFeatured: svcIsFeatured.value,
            isVisible: svcIsVisible.value,
            imageUrl: svcImageUrl.value,
            thumbnailUrl: svcThumbnailUrl.value
        })
    }

    const isServiceDirty = computed(() => {
        const current = JSON.stringify({
            name: svcName.value,
            description: svcDescription.value,
            price: svcPrice.value,
            duration: svcDuration.value,
            category: svcCategory.value,
            schedulingMode: svcSchedulingMode.value,
            defaultProviderId: svcDefaultProviderId.value,
            assignedProviderIds: svcAssignedProviderIds.value,
            availableSlots: svcAvailableSlots.value,
            dateRangeStart: svcDateRangeStart.value,
            dateRangeEnd: svcDateRangeEnd.value,
            timeRangeStart: svcTimeRangeStart.value,
            timeRangeEnd: svcTimeRangeEnd.value,
            providerAvailability: svcProviderAvailability.value,
            isFeatured: svcIsFeatured.value,
            isVisible: svcIsVisible.value,
            imageUrl: svcImageUrl.value,
            thumbnailUrl: svcThumbnailUrl.value
        })
        return current !== initialServiceSnapshot.value
    })

    // Form Validity
    const isSvcFormValid = computed(() => {
        if (!svcName.value) return false
        if (svcDuration.value === null || svcDuration.value <= 0) return false

        // Date Range Validation: Start requires End
        if (svcDateRangeStart.value && !svcDateRangeEnd.value) return false
        if (svcDateRangeEnd.value && !svcDateRangeStart.value) return false
        if (svcDateRangeStart.value && svcDateRangeEnd.value && svcDateRangeEnd.value < svcDateRangeStart.value) return false

        if (svcSchedulingMode.value === 'Standard') {
            // Standard mode requires defined time and date ranges
            if (!svcTimeRangeStart.value || !svcTimeRangeEnd.value) return false
            if (!svcDateRangeStart.value || !svcDateRangeEnd.value) return false
        } else if (svcSchedulingMode.value === 'Fixed Slots') {
            // Fixed Slots requires at least one slot defined
            if (!svcAvailableSlots.value || svcAvailableSlots.value.length === 0) return false
        }
        return true
    })

    const isOverrideFormValid = computed(() => {
        if (!selectedOverrideProviderId.value) return false

        // Date Range Validation: Start requires End
        if (overDateRangeStart.value && !overDateRangeEnd.value) return false
        if (overDateRangeEnd.value && !overDateRangeStart.value) return false
        if (overDateRangeStart.value && overDateRangeEnd.value && overDateRangeEnd.value < overDateRangeStart.value) return false

        if (overrideSchedulingMode.value === 'Fixed Slots') {
            return overrideSlots.value.length > 0
        }
        if (overrideSchedulingMode.value === 'Standard') {
            if (!overTimeRangeStart.value || !overTimeRangeEnd.value) return false
            if (!overDateRangeStart.value || !overDateRangeEnd.value) return false
            return true
        }
        return true
    })

    // Computed Helpers
    const assignedProviders = computed(() => {
        return providers.value.filter(p => svcAssignedProviderIds.value.includes(p.id))
    })

    const overrideProviderName = computed(() => {
        return providers.value.find(p => p.id === selectedOverrideProviderId.value)?.name || ''
    })

    // Methods
    const editingServiceId = ref<number | null>(null)

    // Define minimal VForm interface
    type VForm = {
        validate: () => Promise<{ valid: boolean }>
        reset: () => void
        resetValidation: () => void
    }
    const serviceForm = ref<VForm | null>(null)

    function editService(service: Service) {
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
        svcIsFeatured.value = service.isFeatured || false
        svcIsVisible.value = service.isVisible !== false
        svcImageUrl.value = service.imageUrl || ''
        svcThumbnailUrl.value = service.thumbnailUrl || ''
        takeServiceSnapshot()
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
        svcIsFeatured.value = false
        svcIsVisible.value = true
        svcImageUrl.value = ''
        svcThumbnailUrl.value = ''
        selectedOverrideProviderId.value = null
        overTimeRangeStart.value = null
        overTimeRangeEnd.value = null
        takeServiceSnapshot()
        nextTick(() => {
            if (serviceForm.value) serviceForm.value.resetValidation()
        })
    }

    async function saveService() {
        if (!serviceForm.value) return { success: false }
        const { valid } = await serviceForm.value.validate()
        if (!valid) return { success: false }

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
            isFeatured: svcIsFeatured.value,
            isVisible: svcIsVisible.value,
            imageUrl: svcImageUrl.value || svcThumbnailUrl.value,
            thumbnailUrl: svcThumbnailUrl.value || svcImageUrl.value
        }

        if (editingServiceId.value) {
            servicesStore.updateService(editingServiceId.value, serviceData)
            providersStore.toggleServiceAssignment(editingServiceId.value, svcAssignedProviderIds.value)
            if (serviceData.defaultProviderId) {
                providersStore.assignService(serviceData.defaultProviderId, editingServiceId.value)
            }
        } else {
            servicesStore.addService(serviceData)
            const newService = services.value[services.value.length - 1]
            if (newService) {
                providersStore.toggleServiceAssignment(newService.id, svcAssignedProviderIds.value)
                if (serviceData.defaultProviderId) {
                    providersStore.assignService(serviceData.defaultProviderId, newService.id)
                }
            }
        }

        const mode = editingServiceId.value ? 'update' : 'add'
        cancelEdit()
        return { success: true, mode }
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
        if (!selectedOverrideProviderId.value) return;

        const mode = overrideSchedulingMode.value;
        svcProviderAvailability.value[selectedOverrideProviderId.value] = {
            schedulingMode: mode,
            availableSlots: mode === 'Fixed Slots' ? JSON.parse(JSON.stringify(overrideSlots.value)) : [],
            dateRange: mode === 'Standard' ? { start: overDateRangeStart.value, end: overDateRangeEnd.value } : { start: null, end: null },
            timeRange: mode === 'Standard' ? { start: overTimeRangeStart.value, end: overTimeRangeEnd.value } : { start: null, end: null }
        }
        selectedOverrideProviderId.value = null
    }

    function editOverride(pid: number) {
        selectedOverrideProviderId.value = pid
    }

    // Watch for override provider selection to load data
    watch(selectedOverrideProviderId, (id) => {
        if (id && svcProviderAvailability.value[id]) {
            const ov = svcProviderAvailability.value[id]
            overrideSchedulingMode.value = ov.schedulingMode || 'Standard'
            overrideSlots.value = JSON.parse(JSON.stringify(ov.availableSlots || []))
            overDateRangeStart.value = ov.dateRange?.start || null
            overDateRangeEnd.value = ov.dateRange?.end || null
            overTimeRangeStart.value = ov.timeRange?.start || null
            overTimeRangeEnd.value = ov.timeRange?.end || null
        } else {
            // Clear if no override exists for this provider or if deselected
            overrideSchedulingMode.value = 'Standard'
            overrideSlots.value = []
            overDateRangeStart.value = null
            overDateRangeEnd.value = null
            overTimeRangeStart.value = null
            overTimeRangeEnd.value = null
        }
    })

    // Watch assigned providers to cleanup overrides and default provider
    watch(svcAssignedProviderIds, (newIds, oldIds) => {
        // If unassigned, remove from overrides
        const removedIds = oldIds.filter(id => !newIds.includes(id))

        removedIds.forEach(id => {
            if (svcProviderAvailability.value[id]) {
                delete svcProviderAvailability.value[id]
            }
            if (svcDefaultProviderId.value === id) {
                svcDefaultProviderId.value = null
            }
        })
    }, { deep: true })

    // Watch providers list to cleanup deleted providers from form state
    watch(providers, (newProviders) => {
        const currentIds = newProviders.map(p => p.id)

        // Filter out deleted providers from assigned list
        // This will trigger the svcAssignedProviderIds watcher above for further cleanup
        svcAssignedProviderIds.value = svcAssignedProviderIds.value.filter(id => currentIds.includes(id))

        // Also ensure default provider is cleaned if it wasn't in assigned list for some reason
        if (svcDefaultProviderId.value && !currentIds.includes(svcDefaultProviderId.value)) {
            svcDefaultProviderId.value = null
        }
    }, { deep: true })

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

    // Initialize snapshot
    takeServiceSnapshot()

    return {
        svcName,
        svcDescription,
        svcPrice,
        svcDuration,
        svcCategory,
        svcSchedulingMode,
        svcDefaultProviderId,
        svcAssignedProviderIds,
        svcAvailableSlots,
        svcDateRangeStart,
        svcDateRangeEnd,
        svcTimeRangeStart,
        svcTimeRangeEnd,
        svcProviderAvailability,
        svcIsFeatured,
        svcIsVisible,
        svcImageUrl,
        svcThumbnailUrl,
        editingServiceId,
        serviceForm,
        selectedOverrideProviderId,
        overrideSchedulingMode,
        overrideSlots,
        overDate,
        overTime,
        overDateRangeStart,
        overDateRangeEnd,
        overTimeRangeStart,
        overTimeRangeEnd,
        newSlotDate,
        newSlotTime,
        isSvcFormValid,
        isOverrideFormValid,
        assignedProviders,
        overrideProviderName,
        isServiceDirty,
        editService,
        cancelEdit,
        saveService,
        addOverrideSlot,
        saveOverride,
        editOverride,
        addSlot,
        removeSlot
    }
}

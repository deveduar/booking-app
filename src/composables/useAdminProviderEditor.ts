import { ref, computed, nextTick } from 'vue'
import { useProvidersStore, type Provider } from '@/stores/providers'

export function useAdminProviderEditor() {
    const providersStore = useProvidersStore()
    
    // State
    const provName = ref('')
    const provDescription = ref('')
    const provStatus = ref('Available')
    const provImage = ref('')
    const editingProviderId = ref<number | null>(null)
    
    // Dirty Tracking
    const initialSnapshot = ref('')
    
    function takeSnapshot() {
        initialSnapshot.value = JSON.stringify({
            name: provName.value,
            description: provDescription.value,
            status: provStatus.value,
            image: provImage.value
        })
    }
    
    const isProviderDirty = computed(() => {
        const current = JSON.stringify({
            name: provName.value,
            description: provDescription.value,
            status: provStatus.value,
            image: provImage.value
        })
        return current !== initialSnapshot.value
    })

    // Form reference
    type VForm = {
        validate: () => Promise<{ valid: boolean }>;
        reset: () => void;
        resetValidation: () => void;
    }
    const providerForm = ref<VForm | null>(null)

    // Actions
    function editProvider(provider: Provider) {
        editingProviderId.value = provider.id
        provName.value = provider.name
        provDescription.value = provider.description || ''
        provStatus.value = provider.status
        provImage.value = provider.image
        takeSnapshot()
    }

    function cancelProviderEdit() {
        editingProviderId.value = null
        provName.value = ''
        provDescription.value = ''
        provStatus.value = 'Available'
        provImage.value = ''
        takeSnapshot()
        nextTick(() => {
            if (providerForm.value) providerForm.value.resetValidation()
        })
    }

    async function saveProvider() {
        if (!providerForm.value) return { success: false, mode: null }
        const { valid } = await providerForm.value.validate()
        if (!valid) return { success: false, mode: null }

        const providerData = {
            name: provName.value,
            description: provDescription.value,
            status: provStatus.value || 'Available',
            image: provImage.value || '',
        }

        const mode = editingProviderId.value ? 'update' : 'add'

        if (editingProviderId.value) {
            providersStore.updateProvider(editingProviderId.value, providerData)
        } else {
            providersStore.addProvider({
                ...providerData,
                serviceIds: [] // Initialize with empty services
            })
        }

        cancelProviderEdit()
        return { success: true, mode }
    }
    
    function removeProvider(id: number) {
        providersStore.removeProvider(id)
    }

    // Initialize snapshot
    takeSnapshot()

    return {
        provName,
        provDescription,
        provStatus,
        provImage,
        editingProviderId,
        providerForm,
        isProviderDirty,
        editProvider,
        cancelProviderEdit,
        saveProvider,
        removeProvider
    }
}

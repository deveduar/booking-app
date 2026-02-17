import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { providersData } from '@/data/initialData'

export type Provider = {
  id: number
  name: string
  status: string
  image: string
  serviceIds: number[]
}

const STORAGE_KEY = 'salon_providers'

export const useProvidersStore = defineStore('providers', () => {
  const storedProviders = localStorage.getItem(STORAGE_KEY)
  const providers = ref<Provider[]>(storedProviders ? JSON.parse(storedProviders) : providersData)

  watch(
    providers,
    (newProviders) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProviders))
    },
    { deep: true }
  )

  function setProviders(nextProviders: Provider[]) {
    providers.value = nextProviders
  }

  function addProvider(provider: Omit<Provider, 'id'>) {
    const nextId =
      providers.value.reduce((max, p) => Math.max(max, p.id), 0) + 1
    providers.value.push({ id: nextId, ...provider })
  }

  function removeProvider(id: number) {
    providers.value = providers.value.filter(p => p.id !== id)
  }

  function getByService(serviceId: number) {
    return providers.value.filter(p => p.serviceIds.includes(serviceId))
  }

  function assignService(providerId: number, serviceId: number) {
    const p = providers.value.find(p => p.id === providerId)
    if (p && !p.serviceIds.includes(serviceId)) {
      p.serviceIds.push(serviceId)
    }
  }

  return {
    providers,
    setProviders,
    addProvider,
    removeProvider,
    getByService,
    assignService,
  }
})

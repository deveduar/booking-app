import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { servicesData } from '@/data/initialData'

export type AvailabilitySlot = {
  date: string
  times: string[]
}

export type DateRange = {
  start: string | null
  end: string | null
}

export type TimeRange = {
  start: string | null
  end: string | null
}

export type SchedulingMode = 'Standard' | 'Fixed Slots'

export type AvailabilityOverride = {
  schedulingMode?: SchedulingMode
  availableSlots?: AvailabilitySlot[]
  dateRange?: DateRange
  timeRange?: TimeRange
}

export type Service = {
  id: number
  name: string
  description: string
  price: number
  duration: number
  category: string
  schedulingMode?: SchedulingMode
  defaultDate?: string
  defaultTime?: string
  defaultProviderId?: number
  availableSlots?: AvailabilitySlot[]
  dateRange?: DateRange
  timeRange?: TimeRange
  providerAvailability?: { [providerId: number]: AvailabilityOverride }
}

const STORAGE_KEY = 'salon_services'

export const useServicesStore = defineStore('services', () => {
  const storedServices = localStorage.getItem(STORAGE_KEY)
  const services = ref<Service[]>(storedServices ? JSON.parse(storedServices) : servicesData)

  watch(
    services,
    (newServices) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newServices))
    },
    { deep: true }
  )

  const categories = computed(() => {
    const set = new Set(services.value.map(service => service.category))
    return Array.from(set).sort()
  })

  function getById(id: number) {
    return services.value.find(service => service.id === id)
  }

  function addService(service: Omit<Service, 'id'>) {
    const nextId =
      services.value.reduce((max, s) => Math.max(max, s.id), 0) + 1
    services.value.push({ id: nextId, ...service })
  }

  function removeService(id: number) {
    services.value = services.value.filter(s => s.id !== id)
  }

  function updateService(id: number, updated: Partial<Omit<Service, 'id'>>) {
    const index = services.value.findIndex(s => s.id === id)
    if (index !== -1) {
      services.value[index] = { ...services.value[index], ...updated }
    }
  }

  return {
    services,
    categories,
    getById,
    addService,
    removeService,
    updateService,
  }
})


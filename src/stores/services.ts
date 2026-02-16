import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { servicesData } from '@/data/servicesData'

export type Service = {
  id: number
  name: string
  description: string
  price: number
  duration: number
  category: string
}

export const useServicesStore = defineStore('services', () => {
  const services = ref<Service[]>(servicesData)

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

  return {
    services,
    categories,
    getById,
    addService,
    removeService,
  }
})


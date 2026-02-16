import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Provider = {
  id: number
  name: string
  status: string
  image: string
}

const initialProviders: Provider[] = [
  {
    id: 1,
    name: 'Alexa',
    status: 'Available',
    image: 'https://cdn.usegalileo.ai/sdxl10/4d0bd9a4-2f47-4eeb-8fbf-5fb13eaf0a0b.png',
  },
  {
    id: 2,
    name: 'Renee',
    status: 'Available',
    image: 'https://cdn.usegalileo.ai/sdxl10/7cb6bea5-df1a-43ff-97c9-cc743fe8520d.png',
  },
  {
    id: 3,
    name: 'Samantha',
    status: 'Available',
    image: 'https://cdn.usegalileo.ai/sdxl10/014920d7-e0b4-4ffa-823a-811dd0d3cdbc.png',
  },
]

export const useProvidersStore = defineStore('providers', () => {
  const providers = ref<Provider[]>(initialProviders)

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

  return {
    providers,
    setProviders,
    addProvider,
    removeProvider,
  }
})

<template>
  <v-container class="py-6">
    <h1 class="text-h4 font-weight-bold mb-6">Admin Panel</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Services</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addService">
              <v-text-field v-model="svcName" label="Name" required />
              <v-text-field v-model="svcDescription" label="Description" />
              <v-text-field v-model.number="svcPrice" label="Price" type="number" />
              <v-text-field v-model.number="svcDuration" label="Duration (mins)" type="number" />
              <v-text-field v-model="svcCategory" label="Category" />
              <v-btn type="submit" color="primary" class="mt-2" block>Add Service</v-btn>
            </v-form>
            <v-list class="mt-4">
              <v-list-item v-for="s in services" :key="s.id">
                <v-list-item-title>{{ s.name }} · {{ s.category }}</v-list-item-title>
                <v-list-item-subtitle>\${{ s.price.toFixed(2) }} · {{ s.duration }} mins</v-list-item-subtitle>
                <template #append>
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
            <v-form @submit.prevent="addProvider">
              <v-text-field v-model="provName" label="Name" required />
              <v-text-field v-model="provStatus" label="Status" />
              <v-text-field v-model="provImage" label="Image URL" />
              <v-btn type="submit" color="primary" class="mt-2" block>Add Provider</v-btn>
            </v-form>
            <v-list class="mt-4">
              <v-list-item v-for="p in providers" :key="p.id">
                <template #prepend>
                  <v-avatar><v-img :src="p.image" /></v-avatar>
                </template>
                <v-list-item-title>{{ p.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ p.status }}</v-list-item-subtitle>
                <template #append>
                  <v-btn icon="mdi-delete" variant="text" @click="removeProvider(p.id)" />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useServicesStore } from '@/stores/services'
import { useProvidersStore } from '@/stores/providers'

const servicesStore = useServicesStore()
const { services } = storeToRefs(servicesStore)

const providersStore = useProvidersStore()
const { providers } = storeToRefs(providersStore)

const svcName = ref('')
const svcDescription = ref('')
const svcPrice = ref<number | null>(null)
const svcDuration = ref<number | null>(null)
const svcCategory = ref('')

function addService() {
  if (!svcName.value) return
  servicesStore.addService({
    name: svcName.value,
    description: svcDescription.value || '',
    price: Number(svcPrice.value ?? 0),
    duration: Number(svcDuration.value ?? 0),
    category: svcCategory.value || 'General',
  })
  svcName.value = ''
  svcDescription.value = ''
  svcPrice.value = null
  svcDuration.value = null
  svcCategory.value = ''
}

function removeService(id: number) {
  servicesStore.removeService(id)
}

const provName = ref('')
const provStatus = ref('Available')
const provImage = ref('')

function addProvider() {
  if (!provName.value) return
  providersStore.addProvider({
    name: provName.value,
    status: provStatus.value || 'Available',
    image: provImage.value || '',
  })
  provName.value = ''
  provStatus.value = 'Available'
  provImage.value = ''
}

function removeProvider(id: number) {
  providersStore.removeProvider(id)
}
</script>


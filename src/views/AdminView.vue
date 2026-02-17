<template>
  <v-container class="py-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold">Admin Dashboard</h1>
      <v-chip color="primary" variant="elevated">System Online</v-chip>
    </div>

    <!-- Dashboard Metrics -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-card color="primary" theme="dark">
          <v-card-text class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-briefcase-outline</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ services.length }}</div>
              <div class="text-subtitle-1">Services</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="secondary" theme="dark">
          <v-card-text class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-account-group-outline</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ providers.length }}</div>
              <div class="text-subtitle-1">Providers</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="success" theme="dark">
          <v-card-text class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-calendar-check-outline</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ upcomingAppointments.length }}</div>
              <div class="text-subtitle-1">Upcoming Appointments</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Services</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addService">
              <v-row dense>
                <v-col cols="12"><v-text-field v-model="svcName" label="Name" required /></v-col>
                <v-col cols="12"><v-text-field v-model="svcDescription" label="Description" /></v-col>
                <v-col cols="6"><v-text-field v-model.number="svcPrice" label="Price" type="number" /></v-col>
                <v-col cols="6"><v-text-field v-model.number="svcDuration" label="Duration (mins)" type="number" /></v-col>
                <v-col cols="12"><v-text-field v-model="svcCategory" label="Category" /></v-col>
                
                <v-col cols="12">
                  <v-select
                    v-model="svcDefaultProviderId"
                    :items="providers"
                    item-title="name"
                    item-value="id"
                    label="Default Provider (Optional)"
                    variant="outlined"
                    density="compact"
                    clearable
                  />
                </v-col>
                
                <v-col cols="12">
                  <div class="text-subtitle-2 mb-1">Defaults (Optional)</div>
                   <DateTimePicker
                    :date="svcDefaultDate"
                    :time="svcDefaultTime"
                    @update:date="svcDefaultDate = $event"
                    @update:time="svcDefaultTime = $event"
                  />
                </v-col>
               </v-row>
              <v-btn type="submit" color="primary" class="mt-2" block>
                {{ editingServiceId ? 'Save Changes' : 'Add Service' }}
              </v-btn>
              <v-btn v-if="editingServiceId" color="grey" variant="text" class="mt-1" block @click="cancelEdit">
                Cancel
              </v-btn>
            </v-form>
            <v-list class="mt-4">
              <v-list-item v-for="s in services" :key="s.id">
                <v-list-item-title>{{ s.name }} · {{ s.category }}</v-list-item-title>
                <v-list-item-subtitle>
                  \${{ (Number(s.price) || 0).toFixed(2) }} · {{ Number(s.duration) || 0 }} mins
                  <div v-if="s.defaultDate" class="text-caption text-primary">Default: {{ s.defaultDate }} {{ s.defaultTime }}</div>
                </v-list-item-subtitle>
                 <template #append>
                  <v-btn icon="mdi-pencil" variant="text" @click="editService(s)" />
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
                <v-list-item-subtitle>{{ p.status }} · {{ p.serviceIds.length }} services</v-list-item-subtitle>
                <template #append>
                  <v-btn icon="mdi-delete" variant="text" @click="removeProvider(p.id)" />
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Relational Management Section -->
    <v-row v-if="providers.length > 0 && services.length > 0">
      <v-col cols="12">
        <v-card>
          <v-card-title>Manage Provider Services</v-card-title>
          <v-card-text>
            <v-row v-for="p in providers" :key="p.id" class="align-center border-bottom py-2">
              <v-col cols="12" sm="3" class="font-weight-bold">
                {{ p.name }}
              </v-col>
              <v-col cols="12" sm="9">
                <v-select
                  v-model="p.serviceIds"
                  :items="services"
                  item-title="name"
                  item-value="id"
                  label="Assigned Services"
                  multiple
                  density="compact"
                  variant="outlined"
                  hide-details
                >
                  <template #chip="{ props: chipProps, item }">
                    <v-chip
                      v-bind="chipProps"
                      :color="item.raw.defaultProviderId === p.id ? 'primary' : ''"
                      :prepend-icon="item.raw.defaultProviderId === p.id ? 'mdi-star' : ''"
                      size="small"
                    >
                      {{ item.title }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useServicesStore } from '@/stores/services'
import { useProvidersStore } from '@/stores/providers'
import { useAppointmentsStore } from '@/stores/appointments'
import DateTimePicker from '@/components/DateTimePicker.vue'

const servicesStore = useServicesStore()
const { services } = storeToRefs(servicesStore)

const providersStore = useProvidersStore()
const { providers } = storeToRefs(providersStore)

const appointmentsStore = useAppointmentsStore()
const { upcoming: upcomingAppointments } = storeToRefs(appointmentsStore)

const svcName = ref('')
const svcDescription = ref('')
const svcPrice = ref<number | null>(null)
const svcDuration = ref<number | null>(null)
const svcCategory = ref('')
const svcDefaultProviderId = ref<number | null>(null)

const svcDefaultDate = ref<string | null>(null)
const svcDefaultTime = ref<string | null>(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const editingServiceId = ref<number | null>(null)

function editService(service: any) {
  editingServiceId.value = service.id
  svcName.value = service.name
  svcDescription.value = service.description
  svcPrice.value = service.price
  svcDuration.value = service.duration
  svcCategory.value = service.category
  svcDefaultProviderId.value = service.defaultProviderId || null
  svcDefaultDate.value = service.defaultDate || null
  svcDefaultTime.value = service.defaultTime || null
}

function cancelEdit() {
  editingServiceId.value = null
  svcName.value = ''
  svcDescription.value = ''
  svcPrice.value = null
  svcDuration.value = null
  svcCategory.value = ''
  svcDefaultProviderId.value = null
  svcDefaultDate.value = null
  svcDefaultTime.value = null
}

function addService() {
  if (!svcName.value) return
  
  const serviceData = {
    name: svcName.value,
    description: svcDescription.value || '',
    price: Number(svcPrice.value ?? 0),
    duration: Number(svcDuration.value ?? 0),
    category: svcCategory.value || 'General',
    defaultDate: svcDefaultDate.value || undefined,
    defaultTime: svcDefaultTime.value || undefined,
    defaultProviderId: svcDefaultProviderId.value || undefined,
    availableSlots: [],
  }

  if (editingServiceId.value) {
    servicesStore.updateService(editingServiceId.value, serviceData)
    if (serviceData.defaultProviderId) {
      providersStore.assignService(serviceData.defaultProviderId, editingServiceId.value)
    }
    snackbarText.value = 'Service updated successfully!'
  } else {
    // We need the ID of the new service to assign it to provider
    // servicesStore.addService returns nothing, but we can find the new max ID
    servicesStore.addService(serviceData)
    const newService = services.value[services.value.length - 1]
    if (serviceData.defaultProviderId && newService) {
      providersStore.assignService(serviceData.defaultProviderId, newService.id)
    }
    snackbarText.value = 'Service added successfully!'
  }
  
  snackbarColor.value = 'success'
  snackbar.value = true
  cancelEdit()
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
    serviceIds: [],
  })
  provName.value = ''
  provStatus.value = 'Available'
  provImage.value = ''
}

function removeProvider(id: number) {
  providersStore.removeProvider(id)
}
</script>


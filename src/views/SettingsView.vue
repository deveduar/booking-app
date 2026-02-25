<template>
  <v-container class="py-6" v-if="draftSettings">
    <h1 class="text-h4 font-weight-bold mb-6">Settings</h1>

    <v-card>
      <v-tabs v-model="tab" color="primary">
        <v-tab value="general">General</v-tab>
        <v-tab value="company">Company Info</v-tab>
        <v-tab value="home">Home Page Editor</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <!-- General Settings -->
          <v-window-item value="general">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="draftSettings.dateFormat"
                  label="Date Format"
                  :items="['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY']"
                  variant="outlined"
                  hint="This will affect how dates are displayed across the app."
                  persistent-hint
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="draftSettings.timeFormat"
                  label="Time Format"
                  :items="['12h', '24h']"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="draftSettings.timezone"
                  label="Timezone"
                  :items="['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']"
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Company Info -->
          <v-window-item value="company">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="draftSettings.company.brandName"
                  label="Brand Name"
                  variant="outlined"
                  hint="Displayed in Header and Footer"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="draftSettings.company.footerText"
                  label="Footer Text"
                  variant="outlined"
                  rows="2"
                  hint="Message displayed in the footer"
                  persistent-hint
                ></v-textarea>
              </v-col>
            </v-row>

            <div class="text-h6 mt-6 mb-4">Social Links</div>
            <v-row v-for="(link, index) in draftSettings.company.socialLinks" :key="index" align="center">
              <v-col cols="12" sm="3">
                 <v-text-field
                  v-model="link.platform"
                  label="Platform"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                 <v-text-field
                  v-model="link.url"
                  label="URL"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3">
                 <v-text-field
                  v-model="link.icon"
                  label="Icon (mdi-)"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2">
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  variant="text"
                  size="small"
                  @click="removeSocialLink(index)"
                ></v-btn>
              </v-col>
            </v-row>
             <v-btn
              variant="text"
              color="primary"
              prepend-icon="mdi-plus"
              class="mt-2"
              @click="addSocialLink"
            >
              Add Social Link
            </v-btn>
          </v-window-item>

          <!-- Home Page Editor -->
          <v-window-item value="home">
            <v-expansion-panels variant="accordion" multiple>
              
              <!-- Hero Section -->
              <v-expansion-panel title="Hero Section">
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="draftSettings.hero.title"
                        label="Hero Title"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="draftSettings.hero.ctaText"
                        label="CTA Button Text"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="draftSettings.hero.subtitle"
                        label="Hero Subtitle"
                        variant="outlined"
                        rows="2"
                      ></v-textarea>
                    </v-col>
                     <v-col cols="12">
                      <v-text-field
                        v-model="draftSettings.hero.ctaLink"
                        label="CTA Button Link"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <div class="text-subtitle-1 font-weight-bold mt-4 mb-2">Hero Images</div>
                  <v-row v-for="(img, index) in draftSettings.hero.images" :key="index" align="center" dense>
                    <v-col cols="10">
                      <v-text-field
                        v-model="img.src"
                        :label="`Image URL ${index + 1}`"
                        variant="outlined"
                        density="compact"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-btn
                        icon="mdi-delete"
                        color="error"
                        variant="text"
                        size="small"
                        @click="removeHeroImage(index)"
                        :disabled="draftSettings.hero.images.length <= 1"
                      ></v-btn>
                    </v-col>
                  </v-row>
                  <v-btn
                    variant="text"
                    color="primary"
                    prepend-icon="mdi-plus"
                    class="mt-2"
                    @click="addHeroImage"
                  >
                    Add Image
                  </v-btn>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Featured Content -->
              <v-expansion-panel title="Featured Content">
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="localFeaturedServiceIds"
                        :items="allServices"
                        item-title="name"
                        item-value="id"
                        label="Featured Services"
                        multiple
                        chips
                        closable-chips
                        variant="outlined"
                        hint="Select services to display on the home page."
                        persistent-hint
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="localFeaturedExpertIds"
                        :items="allProviders"
                        item-title="name"
                        item-value="id"
                        label="Featured Experts"
                        multiple
                        chips
                        closable-chips
                        variant="outlined"
                        hint="Select experts to display on the home page."
                        persistent-hint
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>

            </v-expansion-panels>
          </v-window-item>
        </v-window>
      </v-card-text>
      
      <v-card-actions class="justify-end pa-4">
          <v-btn color="grey" variant="text" @click="resetDraft" class="mr-2">
            Reset Changes
          </v-btn>
          <v-btn color="primary" variant="elevated" @click="handleSave">
            Save Changes
          </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar" color="success">
      Settings saved successfully!
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettings } from '@/composables/useSettings'
import { useServicesStore } from '@/stores/services'
import { useProvidersStore } from '@/stores/providers'

const { draftSettings, resetDraft, commitSettings } = useSettings()

const servicesStore = useServicesStore()
const { services: allServices } = storeToRefs(servicesStore)

const providersStore = useProvidersStore()
const { providers: allProviders } = storeToRefs(providersStore)

// Local state for featured items (only apply on save)
const localFeaturedServiceIds = ref<number[]>([])
const localFeaturedExpertIds = ref<number[]>([])

onMounted(() => {
  resetDraft()
  // Load current featured IDs
  localFeaturedServiceIds.value = allServices.value.filter(s => s.isFeatured).map(s => s.id)
  localFeaturedExpertIds.value = allProviders.value.filter(p => p.isFeatured).map(p => p.id)
})

const tab = ref('general')
const snackbar = ref(false)

function addHeroImage() {
  if (draftSettings.value) {
    draftSettings.value.hero.images.push({ src: '' })
  }
}

function removeHeroImage(index: number) {
  if (draftSettings.value && draftSettings.value.hero.images.length > 1) {
    draftSettings.value.hero.images.splice(index, 1)
  }
}

function addSocialLink() {
  if (draftSettings.value) {
    draftSettings.value.company.socialLinks.push({ platform: 'New Platform', url: '#', icon: 'mdi-web' })
  }
}

function removeSocialLink(index: number) {
  if (draftSettings.value) {
    draftSettings.value.company.socialLinks.splice(index, 1)
  }
}

function handleSave() {
  // 1. Commit general settings
  commitSettings()

  // 2. Apply featured content changes to stores
  allServices.value.forEach(s => {
    s.isFeatured = localFeaturedServiceIds.value.includes(s.id)
  })
  allProviders.value.forEach(p => {
    p.isFeatured = localFeaturedExpertIds.value.includes(p.id)
  })

  snackbar.value = true
}
</script>

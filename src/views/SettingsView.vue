<template>
  <v-container class="py-6">
    <h1 class="text-h4 font-weight-bold mb-6">Settings</h1>

    <v-card v-if="draftSettings">
      <v-tabs v-model="tab" color="primary">
        <v-tab value="profile">My Profile</v-tab>
        <v-tab v-if="isAdmin" value="general">General</v-tab>
        <v-tab v-if="isAdmin" value="company">Company Info</v-tab>
        <v-tab v-if="isAdmin" value="home">Home Page Editor</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <!-- My Profile -->
          <v-window-item value="profile">
            <v-row v-if="user">
              <v-col cols="12" md="4" class="text-center">
                <v-avatar size="150" class="mb-4" border>
                  <v-img :src="profileDraft.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'"></v-img>
                </v-avatar>
                <div class="text-h6">{{ user.name }}</div>
                <div class="text-subtitle-1 text-grey">{{ user.role }}</div>
              </v-col>
              <v-col cols="12" md="8">
                 <v-form @submit.prevent="handleSaveProfile">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="profileDraft.name"
                        label="Full Name"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="profileDraft.email"
                        label="Email Address"
                        variant="outlined"
                        readonly
                        disabled
                        hint="Email cannot be changed"
                        persistent-hint
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="profileDraft.avatar"
                        label="Avatar URL"
                        variant="outlined"
                        hint="Link to your profile picture"
                        persistent-hint
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-end mt-4">
                      <v-btn color="primary" type="submit" prepend-icon="mdi-account-check">
                        Update Profile
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- General Settings (Admin Only) -->
          <v-window-item v-if="isAdmin" value="general">
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

          <!-- Company Info (Admin Only) -->
          <v-window-item v-if="isAdmin" value="company">
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

          <!-- Home Page Editor (Admin Only) -->
          <v-window-item v-if="isAdmin" value="home">
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
                  <!-- ... rest of hero images code ... -->

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
import { useAuthStore } from '@/stores/auth'

const { draftSettings, resetDraft, commitSettings } = useSettings()

const servicesStore = useServicesStore()
const { services: allServices } = storeToRefs(servicesStore)

const providersStore = useProvidersStore()
const { providers: allProviders } = storeToRefs(providersStore)

const authStore = useAuthStore()
const { user, isAdmin } = storeToRefs(authStore)

const profileDraft = ref({
  name: '',
  email: '',
  avatar: ''
})

// Local state for featured items (only apply on save)
const localFeaturedServiceIds = ref<number[]>([])
const localFeaturedExpertIds = ref<number[]>([])

onMounted(() => {
  resetDraft()
  
  if (user.value) {
    profileDraft.value = {
      name: user.value.name,
      email: user.value.email,
      avatar: user.value.avatar || ''
    }
  }

  // Load current featured IDs
  localFeaturedServiceIds.value = allServices.value.filter(s => s.isFeatured).map(s => s.id)
  localFeaturedExpertIds.value = allProviders.value.filter(p => p.isFeatured).map(p => p.id)
})

const tab = ref('profile')
const snackbar = ref(false)
const snackbarText = ref('Settings saved successfully!')

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

function handleSaveProfile() {
  authStore.updateProfile({
    name: profileDraft.value.name,
    avatar: profileDraft.value.avatar
  })
  snackbarText.value = 'Profile updated successfully!'
  snackbar.value = true
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

  snackbarText.value = 'Salon settings saved successfully!'
  snackbar.value = true
}
</script>

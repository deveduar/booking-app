import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { initialSettings } from '@/data/initialData'

export type HeroSection = {
  title: string
  subtitle: string
  images: { src: string }[]
  ctaText: string
  ctaLink: string
}

export type SocialLink = {
  platform: string // 'facebook', 'twitter', 'instagram', 'linkedin', etc.
  url: string
  icon: string // mdi icon name
}

export type CompanyInfo = {
  brandName: string
  footerText: string
  socialLinks: SocialLink[]
}

export type SettingsState = {
  dateFormat: string
  timeFormat: '12h' | '24h'
  timezone: string
  hero: HeroSection
  company: CompanyInfo
}

const STORAGE_KEY = 'salon_settings'

export const useSettingsStore = defineStore('settings', () => {
  const storedSettings = localStorage.getItem(STORAGE_KEY)
  const initialState: SettingsState = storedSettings ? JSON.parse(storedSettings) : {
    dateFormat: initialSettings.dateFormat,
    timeFormat: initialSettings.timeFormat,
    timezone: initialSettings.timezone,
    hero: initialSettings.hero,
    company: initialSettings.company
  }

  // Handle migration for existing stored settings without company info
  if (!initialState.company) {
    initialState.company = initialSettings.company
  }

  const dateFormat = ref(initialState.dateFormat)
  const timeFormat = ref(initialState.timeFormat)
  const timezone = ref(initialState.timezone)
  const hero = ref(initialState.hero)
  const company = ref(initialState.company)

  function saveSettings(state: SettingsState) {
    dateFormat.value = state.dateFormat
    timeFormat.value = state.timeFormat
    timezone.value = state.timezone
    hero.value = JSON.parse(JSON.stringify(state.hero))
    company.value = JSON.parse(JSON.stringify(state.company))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  function updateHero(newHero: Partial<HeroSection>) {
    hero.value = { ...hero.value, ...newHero }
  }

  function updateCompany(newCompany: Partial<CompanyInfo>) {
    company.value = { ...company.value, ...newCompany }
  }

  return {
    dateFormat,
    timeFormat,
    timezone,
    hero,
    company,
    updateHero,
    updateCompany,
    saveSettings
  }
})

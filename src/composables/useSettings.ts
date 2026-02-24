import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { parseTimeMin, formatTimeMin } from '@/utils/timeUtils'

export function useSettings() {
  const settingsStore = useSettingsStore()
  const { dateFormat, timeFormat, timezone } = storeToRefs(settingsStore)

  function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length !== 3) return dateStr // Return original if not YYYY-MM-DD

    const [y, m, d] = parts
    switch (dateFormat.value) {
      case 'MM/DD/YYYY': return `${m}/${d}/${y}`
      case 'DD/MM/YYYY': return `${d}/${m}/${y}`
      default: return dateStr // YYYY-MM-DD
    }
  }

  function formatTime(timeStr: string | null | undefined, includeTimezone = false): string {
    if (!timeStr) return ''
    const minutes = parseTimeMin(timeStr)
    const formatted = formatTimeMin(minutes, timeFormat.value as '12h' | '24h')
    
    if (includeTimezone && timezone.value && timezone.value !== 'UTC') {
       return `${formatted} (${timezone.value})`
    }
    return formatted
  }

  return {
    dateFormat,
    timeFormat,
    timezone,
    formatDate,
    formatTime
  }
}

import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useProvidersStore } from '@/stores/providers';
import { useServicesStore } from '@/stores/services';
import { useAppointmentsStore } from '@/stores/appointments';
import { parseTimeMin, formatTimeMin } from '@/utils/timeUtils';
import { useSettings } from '@/composables/useSettings';
// import type { Service, AvailabilityOverride } from '@/stores/services';

export function useBooking() {
  const { timeFormat } = useSettings();
  const providersStore = useProvidersStore();
  const { providers } = storeToRefs(providersStore);

  const servicesStore = useServicesStore();
  const { services } = storeToRefs(servicesStore);

  const appointmentsStore = useAppointmentsStore();

  const selectedServiceId = ref<number | null>(null);
  const selectedProviderId = ref<number | null>(null);
  const selectedDate = ref<string | null>(null);
  const selectedTime = ref<string | null>(null);

  const serviceItems = computed(() => services.value);

  const providerItems = computed(() => {
    if (!selectedServiceId.value) return providers.value;
    return providersStore.getByService(selectedServiceId.value);
  });

  const selectedService = computed(() =>
    services.value.find(s => s.id === selectedServiceId.value)
  );

  const activeAvailability = computed(() => {
    if (!selectedService.value) return null;
    const service = selectedService.value;
    const providerId = selectedProviderId.value;

    // Check for provider override
    if (providerId && service.providerAvailability && service.providerAvailability[providerId]) {
      const ov = service.providerAvailability[providerId];
      return {
        ...ov,
        schedulingMode: ov.schedulingMode || service.schedulingMode,
        // Ensure structure matches what DateTimePicker expects
        availableSlots: ov.availableSlots || [],
        dateRange: ov.dateRange,
        timeRange: ov.timeRange
      };
    }

    // Fallback to service defaults based on mode
    return {
      schedulingMode: service.schedulingMode,
      availableSlots: service.schedulingMode === 'Fixed Slots' ? service.availableSlots : [],
      dateRange: service.schedulingMode === 'Standard' ? service.dateRange : undefined,
      timeRange: service.schedulingMode === 'Standard' ? service.timeRange : undefined
    };
  });

  const isSpecialistOverride = computed(() => {
    if (!selectedService.value || !selectedProviderId.value) return false;
    return !!(selectedService.value.providerAvailability?.[selectedProviderId.value]);
  });

  const canSubmit = computed(() => !!(selectedServiceId.value && selectedProviderId.value && selectedDate.value && selectedTime.value));

  // Watch for availability changes to Auto-Select earliest
  watch(() => activeAvailability.value, (avail) => {
    if (!avail) return;

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const currentTimeMin = now.getHours() * 60 + now.getMinutes();

    let earliestDate: string | null = null;
    let earliestTime: string | null = null;

    if (avail.availableSlots && avail.availableSlots.length > 0) {
      // Find earliest date >= today that has at least one future time
      const sortedSlots = [...avail.availableSlots].sort((a, b) => a.date.localeCompare(b.date));
      const validSlot = sortedSlots.find(s => {
        if (s.date < todayStr) return false;
        if (s.date === todayStr) return s.times.some(t => parseTimeMin(t) > currentTimeMin);
        return true;
      });

      if (validSlot) {
        earliestDate = validSlot.date;
        if (validSlot.date === todayStr) {
          earliestTime = validSlot.times.find(t => parseTimeMin(t) > currentTimeMin) || null;
        } else {
          earliestTime = validSlot.times[0];
        }
      }
    } else if (avail.dateRange?.start) {
      // Range based
      const rangeStart = avail.dateRange.start;
      const rangeEnd = avail.dateRange.end;

      let potentialDate: string | null = rangeStart >= todayStr ? rangeStart : todayStr;

      // Only skip today if the ENTIRE time window has already passed
      if (potentialDate === todayStr && avail.timeRange?.end) {
        const endMin = parseTimeMin(avail.timeRange.end);
        if (currentTimeMin >= endMin) {
          // The window is truly exhausted — advance to tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(now.getDate() + 1);
          const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

          potentialDate = tomorrowStr;
          // Check if tomorrow is still within the service's date range
          if (rangeEnd && potentialDate > rangeEnd) {
            potentialDate = null;
          }
        }
      }

      earliestDate = potentialDate;

      if (earliestDate && avail.timeRange?.start) {
        const startMin = parseTimeMin(avail.timeRange.start);
        // If today and the start time has already passed, let the DateTimePicker
        // find the first valid future slot automatically (leave earliestTime = null)
        if (earliestDate === todayStr && startMin <= currentTimeMin) {
          earliestTime = null;
        } else {
          // Use formatTimeMin to guarantee the format matches what allowedTimesForDate generates
          earliestTime = formatTimeMin(startMin, timeFormat.value as '12h' | '24h');
        }
      }
    }

    // Always reset if current selection is invalid or we just switched service/provider
    selectedDate.value = earliestDate;
    selectedTime.value = earliestTime;
  }, { deep: true });

  // Watch for provider changes to auto-select service if none selected
  watch(selectedProviderId, (newProvId) => {
    if (newProvId && !selectedServiceId.value) {
      const provider = providers.value.find(p => p.id === newProvId);
      if (provider && provider.serviceIds.length > 0) {
        let serviceId = provider.preferredServiceId;
        if (!serviceId || !provider.serviceIds.includes(serviceId)) {
          serviceId = provider.serviceIds[0];
        }
        selectedServiceId.value = serviceId;
      }
    }
  });

  // Watch for service changes to Reset or auto-select provider
  watch(selectedServiceId, (newId, oldId) => {
    if (newId && newId !== oldId) {
      const availableProviders = providersStore.getByService(newId);

      // If current provider is NOT valid for this service, reset it
      if (selectedProviderId.value && !availableProviders.find(p => p.id === selectedProviderId.value)) {
        selectedProviderId.value = null;
      }

      // Auto-select logic:
      // 1. Try Default Provider
      // 2. Fallback to First Provider (if exists)
      if (!selectedProviderId.value) {
        const service = servicesStore.getById(newId);
        if (service?.defaultProviderId && availableProviders.find(p => p.id === service.defaultProviderId)) {
          setTimeout(() => {
            selectedProviderId.value = service.defaultProviderId!;
          }, 50);
        } else if (availableProviders.length > 0) {
          setTimeout(() => {
            selectedProviderId.value = availableProviders[0].id;
          }, 50);
        }
      }
    }
  });

  const createAppointment = () => {
    const service = servicesStore.getById(selectedServiceId.value as number);
    const provider = providers.value.find(p => p.id === selectedProviderId.value);

    if (!service || !provider || !selectedDate.value || !selectedTime.value) return false;

    appointmentsStore.addAppointment({
      date: selectedDate.value,
      time: selectedTime.value,
      service: service.name,
      provider: provider.name,
      status: 'Upcoming',
    });

    return true;
  };

  return {
    selectedServiceId,
    selectedProviderId,
    selectedDate,
    selectedTime,
    serviceItems,
    providerItems,
    selectedService,
    activeAvailability,
    isSpecialistOverride,
    canSubmit,
    createAppointment
  };
}

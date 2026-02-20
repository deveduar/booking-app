import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBooking } from '../useBooking';
import { useServicesStore } from '@/stores/services';
import { useProvidersStore } from '@/stores/providers';
import { useAppointmentsStore } from '@/stores/appointments';

describe('useBooking', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  it('initializes with null selections', () => {
    const { selectedServiceId, selectedProviderId, selectedDate, selectedTime } = useBooking();
    expect(selectedServiceId.value).toBeNull();
    expect(selectedProviderId.value).toBeNull();
    expect(selectedDate.value).toBeNull();
    expect(selectedTime.value).toBeNull();
  });

  it('filters providers based on selected service', () => {
    const servicesStore = useServicesStore();
    const providersStore = useProvidersStore();
    
    // Setup data
    servicesStore.services = [
      { id: 1, name: 'Service A', description: '', price: 10, duration: 30, category: 'Cat1' },
      { id: 2, name: 'Service B', description: '', price: 20, duration: 60, category: 'Cat1' }
    ];
    providersStore.providers = [
      { id: 101, name: 'Provider 1', serviceIds: [1], status: 'Available', image: '' },
      { id: 102, name: 'Provider 2', serviceIds: [2], status: 'Available', image: '' },
      { id: 103, name: 'Provider 3', serviceIds: [1, 2], status: 'Available', image: '' }
    ];

    const { selectedServiceId, providerItems } = useBooking();

    // Select Service A (id: 1)
    selectedServiceId.value = 1;
    expect(providerItems.value).toHaveLength(2); // Provider 1 & 3
    expect(providerItems.value.map(p => p.id)).toContain(101);
    expect(providerItems.value.map(p => p.id)).toContain(103);

    // Select Service B (id: 2)
    selectedServiceId.value = 2;
    expect(providerItems.value).toHaveLength(2); // Provider 2 & 3
    expect(providerItems.value.map(p => p.id)).toContain(102);
    expect(providerItems.value.map(p => p.id)).toContain(103);
  });

  it('resets provider if not valid for new service', async () => {
    const servicesStore = useServicesStore();
    const providersStore = useProvidersStore();
    
    servicesStore.services = [
      { id: 1, name: 'Service A', description: '', price: 10, duration: 30, category: 'Cat1' },
      { id: 2, name: 'Service B', description: '', price: 20, duration: 60, category: 'Cat1' }
    ];
    providersStore.providers = [
      { id: 101, name: 'Provider 1', serviceIds: [1], status: 'Available', image: '' },
      { id: 102, name: 'Provider 2', serviceIds: [2], status: 'Available', image: '' }
    ];

    const { selectedServiceId, selectedProviderId } = useBooking();

    // Select Service A and Provider 1
    selectedServiceId.value = 1;
    selectedProviderId.value = 101;
    
    // Wait for watchers
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(selectedProviderId.value).toBe(101);

    // Switch to Service B
    selectedServiceId.value = 2;
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Provider 1 is not valid for Service B, should be reset
    // Note: If auto-select logic kicks in (single provider), it might select Provider 2
    // Since Provider 2 is the ONLY provider for Service B, auto-select might happen.
    // Let's check the logic: "If only one provider available and none selected, auto-select"
    // So it should become 102 eventually.
    // But immediately after reset it might be null, then next tick 102.
    // Let's wait a bit more for the setTimeout(50ms) in useBooking
    await new Promise(resolve => setTimeout(resolve, 60));
    
    expect(selectedProviderId.value).toBe(102);
  });

  it('creates an appointment successfully', () => {
    const servicesStore = useServicesStore();
    const providersStore = useProvidersStore();
    const appointmentsStore = useAppointmentsStore();

    servicesStore.services = [{ id: 1, name: 'Service A', description: '', price: 10, duration: 30, category: 'Cat1' }];
    providersStore.providers = [{ id: 101, name: 'Provider 1', serviceIds: [1], status: 'Available', image: '' }];

    const { selectedServiceId, selectedProviderId, selectedDate, selectedTime, createAppointment } = useBooking();

    selectedServiceId.value = 1;
    selectedProviderId.value = 101;
    selectedDate.value = '2025-01-01';
    selectedTime.value = '10:00 AM';

    const result = createAppointment();
    
    expect(result).toBe(true);
    // appointmentsStore loads initial data (4 items), so adding one makes it 5
    expect(appointmentsStore.appointments.length).toBeGreaterThanOrEqual(1);
    const newAppt = appointmentsStore.appointments.find(a => 
      a.service === 'Service A' && a.provider === 'Provider 1' && a.date === '2025-01-01'
    );
    expect(newAppt).toBeDefined();
    expect(newAppt).toMatchObject({
      service: 'Service A',
      provider: 'Provider 1',
      date: '2025-01-01',
      time: '10:00 AM'
    });
  });

  it('validates submission requirements', () => {
    const { selectedServiceId, selectedProviderId, selectedDate, selectedTime, canSubmit } = useBooking();

    expect(canSubmit.value).toBe(false);

    selectedServiceId.value = 1;
    expect(canSubmit.value).toBe(false);

    selectedProviderId.value = 101;
    expect(canSubmit.value).toBe(false);

    selectedDate.value = '2025-01-01';
    expect(canSubmit.value).toBe(false);

    selectedTime.value = '10:00 AM';
    expect(canSubmit.value).toBe(true);
  });
});

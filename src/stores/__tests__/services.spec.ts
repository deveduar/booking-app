import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useServicesStore } from '../services';

describe('Services Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  it('initializes with default data if no local storage', () => {
    const store = useServicesStore();
    expect(store.services.length).toBeGreaterThan(0);
  });

  it('adds a new service', () => {
    const store = useServicesStore();
    const initialCount = store.services.length;
    
    store.addService({
      name: 'New Service',
      description: 'Desc',
      price: 50,
      duration: 60,
      category: 'Test'
    });

    expect(store.services.length).toBe(initialCount + 1);
    const added = store.services.find(s => s.name === 'New Service');
    expect(added).toBeDefined();
    expect(added?.id).toBeGreaterThan(0);
  });

  it('removes a service', () => {
    const store = useServicesStore();
    // Ensure there is at least one service
    if (store.services.length === 0) {
      store.addService({ name: 'Temp', description: '', price: 0, duration: 0, category: '' });
    }
    const service = store.services[0];
    const id = service.id;

    store.removeService(id);
    expect(store.services.find(s => s.id === id)).toBeUndefined();
  });

  it('updates a service', () => {
    const store = useServicesStore();
     if (store.services.length === 0) {
      store.addService({ name: 'Temp', description: '', price: 0, duration: 0, category: '' });
    }
    const service = store.services[0];
    
    store.updateService(service.id, { price: 999 });
    
    const updated = store.getById(service.id);
    expect(updated?.price).toBe(999);
    expect(updated?.name).toBe(service.name); // Should preserve other fields
  });

  it('persists to localStorage on change', async () => {
    const store = useServicesStore();
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    store.addService({
      name: 'Persisted Service',
      description: 'Desc',
      price: 100,
      duration: 30,
      category: 'Test'
    });

    // Watchers are async in Vue 3 (pre-flush or post-flush usually, but sync in tests with await usually?)
    // Actually, Pinia watchers might be sync or nextTick.
    // Let's wait for next tick.
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(setItemSpy).toHaveBeenCalled();
    expect(setItemSpy).toHaveBeenCalledWith('salon_services', expect.any(String));
  });
});

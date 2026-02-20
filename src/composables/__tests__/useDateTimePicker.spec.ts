import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDateTimePicker } from '../useDateTimePicker';
import { ref } from 'vue';

// Mock time utils if necessary, but we can rely on system time mocking for most things
// We'll mock the module just to be safe if it has side effects, but using real utils is fine usually
// However, getTodayStr relies on system time, so vi.setSystemTime is key.

describe('useDateTimePicker', () => {
  beforeEach(() => {
    // Set a fixed date: June 15, 2025, 12:00 PM
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 5, 15, 12, 0, 0)); // Month is 0-indexed
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('filters past dates by default', () => {
    const props = {
      date: null,
      time: null,
      allowPast: false
    };
    const emit = vi.fn();
    const { isAllowedDate } = useDateTimePicker(props, emit);

    // 2025-06-14 (Yesterday) -> Should be false
    expect(isAllowedDate('2025-06-14')).toBe(false);

    // 2025-06-15 (Today) -> Should be true (if times available)
    expect(isAllowedDate('2025-06-15')).toBe(true);

    // 2025-06-16 (Tomorrow) -> Should be true
    expect(isAllowedDate('2025-06-16')).toBe(true);
  });

  it('allows past dates if allowPast is true', () => {
    const props = {
      date: null,
      time: null,
      allowPast: true
    };
    const emit = vi.fn();
    const { isAllowedDate } = useDateTimePicker(props, emit);

    expect(isAllowedDate('2025-06-14')).toBe(true);
  });

  it('respects dateRange props', () => {
    const props = {
      date: null,
      time: null,
      dateRange: { start: '2025-06-20', end: '2025-06-25' }
    };
    const emit = vi.fn();
    const { isAllowedDate } = useDateTimePicker(props, emit);

    expect(isAllowedDate('2025-06-19')).toBe(false); // Before start
    expect(isAllowedDate('2025-06-20')).toBe(true);  // On start
    expect(isAllowedDate('2025-06-23')).toBe(true);  // In middle
    expect(isAllowedDate('2025-06-25')).toBe(true);  // On end
    expect(isAllowedDate('2025-06-26')).toBe(false); // After end
  });

  it('filters available slots correctly', () => {
    const props = {
      date: null,
      time: null,
      availableSlots: [
        { date: '2025-06-14', times: ['10:00 AM'] }, // Past
        { date: '2025-06-15', times: ['09:00 AM', '02:00 PM'] }, // Today
        { date: '2025-06-16', times: ['10:00 AM'] }  // Future
      ],
      allowPast: false
    };
    const emit = vi.fn();
    const { availableDates } = useDateTimePicker(props, emit);

    // Today is 12:00 PM.
    // 09:00 AM is past. 02:00 PM is future.
    // So today should be included because 02:00 PM is valid.
    
    // 2025-06-14 is past -> Excluded
    // 2025-06-16 is future -> Included

    expect(availableDates.value).toContain('2025-06-15');
    expect(availableDates.value).toContain('2025-06-16');
    expect(availableDates.value).not.toContain('2025-06-14');
  });

  it('generates times based on timeRange and duration', () => {
    const props = {
      date: '2025-06-16', // Future date
      time: null,
      timeRange: { start: '10:00 AM', end: '12:00 PM' },
      duration: 60
    };
    const emit = vi.fn();
    const { allowedTimesForDate } = useDateTimePicker(props, emit);

    // 10:00 AM (start) + 60m = 11:00 AM
    // 10:30 AM + 60m = 11:30 AM
    // 11:00 AM + 60m = 12:00 PM
    // 11:30 AM + 60m = 12:30 PM (Out of range)

    // Expected: 10:00 AM, 10:30 AM, 11:00 AM
    // Wait, the loop is `cur + dur <= endMin`.
    // 10:00 (600) + 60 = 660 (11:00). 11:00 <= 12:00 (720). Yes.
    // 10:30 (630) + 60 = 690 (11:30). 11:30 <= 12:00. Yes.
    // 11:00 (660) + 60 = 720 (12:00). 12:00 <= 12:00. Yes.
    // 11:30 (690) + 60 = 750 (12:30). No.

    const times = allowedTimesForDate.value;
    expect(times).toContain('10:00 AM');
    expect(times).toContain('10:30 AM');
    expect(times).toContain('11:00 AM');
    expect(times).not.toContain('11:30 AM');
  });

  it('filters past times for today', () => {
    // Today is 12:00 PM
    const props = {
      date: '2025-06-15', // Today
      time: null,
      timeRange: { start: '09:00 AM', end: '05:00 PM' },
      duration: 60
    };
    const emit = vi.fn();
    const { allowedTimesForDate } = useDateTimePicker(props, emit);

    // Should filter out times before 12:00 PM
    // 09:00 AM -> 10:00 (Past)
    // 10:00 AM -> 11:00 (Past)
    // 11:00 AM -> 12:00 (Past? No, start time 11:00 < 12:00 is Past)
    // 12:00 PM -> 01:00 (Future/Present) -> 12:00 >= 12:00.
    
    // The filter logic is: tMin < currentTime.
    // 12:00 PM (720) < 720? False. So 12:00 PM is kept.
    
    expect(allowedTimesForDate.value).not.toContain('09:00 AM');
    expect(allowedTimesForDate.value).not.toContain('11:00 AM');
    expect(allowedTimesForDate.value).toContain('12:00 PM');
    expect(allowedTimesForDate.value).toContain('1:00 PM');
  });
});

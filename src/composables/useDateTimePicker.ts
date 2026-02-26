import { ref, computed, watch } from 'vue';
import { parseTimeMin, formatTimeMin, formatTimeHHmm, getTodayStr, dateToYMD } from '../utils/timeUtils';
import { useSettings } from '@/composables/useSettings';

export type AvailabilitySlot = {
    date: string;
    times: string[];
};

export type Range = {
    start: string | null;
    end: string | null;
};

export interface DateTimePickerProps {
    date: string | null;
    time: string | null;
    availableSlots?: AvailabilitySlot[];
    dateRange?: Range;
    timeRange?: Range;
    duration?: number;
    hideDate?: boolean;
    hideTime?: boolean;
    allowPast?: boolean; // New prop to bypass current time restrictions
    schedulingMode?: 'Standard' | 'Fixed Slots';
}

export type DateTimePickerEmit = {
    (e: 'update:date', v: string | null): void;
    (e: 'update:time', v: string | null): void;
};

/**
 * Composable for DateTimePicker logic.
 * Encapsulates range filtering, auto-selection, and state synchronization.
 */
export function useDateTimePicker(props: DateTimePickerProps, emit: DateTimePickerEmit) {
    const { timeFormat } = useSettings();
    const menu2 = ref(false);
    const selectedTime = ref(props.time ?? '');

    // Internal Date representation for v-date-input
    const internalDate = ref<Date | null>(null);
    const internalDateStr = ref<string | null>(props.date);

    // --- Computed Properties ---

    /**
     * Filtered list of dates that have available slots and fall within the global range.
     */
    const availableDates = computed(() => {
        const todayStr = getTodayStr();
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        // 1. Fixed Slots Mode
        if (props.availableSlots && props.availableSlots.length > 0) {
            return props.availableSlots
                .filter(s => {
                    if (!props.allowPast && s.date < todayStr) return false;
                    if (props.dateRange?.start && s.date < props.dateRange.start) return false;
                    if (props.dateRange?.end && s.date > props.dateRange.end) return false;

                    // Check if there's at least one time in this slot that's within the global time range
                    const hasValidTimeInRange = s.times.some(t => {
                        const tMin = parseTimeMin(t);
                        if (props.timeRange?.start && tMin < parseTimeMin(props.timeRange.start)) return false;
                        if (props.timeRange?.end && tMin > parseTimeMin(props.timeRange.end)) return false;
                        if (!props.allowPast && s.date === todayStr && tMin < currentTime) return false;
                        return true;
                    });

                    return hasValidTimeInRange;
                })
                .map(s => s.date);
        }

        // 2. Standard Mode (Range based)
        return [];
    });

    /**
     * Validation function for v-date-input constraints.
     */
    const isAllowedDate = (val: unknown) => {
        const dateObj = (val instanceof Date) ? val : new Date(val as string | number);
        const dateStr = dateToYMD(dateObj);
        const todayStr = getTodayStr();

        // Strictly block past dates for everyone unless allowPast is true
        if (!props.allowPast && dateStr < todayStr) return false;

        if (props.dateRange?.start && dateStr < props.dateRange.start) return false;
        if (props.dateRange?.end && dateStr > props.dateRange.end) return false;

        // If today, check if any generic time slots remain in the future
        if (!props.allowPast && dateStr === todayStr) {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            // Check Fixed Slots for today
            if (props.availableSlots && props.availableSlots.length > 0) {
                const slot = props.availableSlots.find(s => s.date === todayStr);
                if (!slot || !slot.times.some(t => parseTimeMin(t) >= currentTime)) return false;
            }
            // Check Standard Range for today
            else if (props.timeRange?.end) {
                if (parseTimeMin(props.timeRange.end) <= currentTime) return false;
            }
        }

        return true;
    };

    /**
     * Filtered times for the currently selected date.
     */
    const allowedTimesForDate = computed(() => {
        if (!internalDateStr.value) return null;

        let times: string[] = [];
        if (props.availableSlots && props.availableSlots.length > 0) {
            const slot = props.availableSlots.find(s => s.date === internalDateStr.value);
            if (!slot) return [];
            // Normalize to display format based on settings
            times = slot.times.map(t => formatTimeMin(parseTimeMin(t), timeFormat.value as '12h' | '24h'));
        } else if (props.timeRange?.start && props.timeRange?.end && props.duration) {
            // Generate slots from range and duration using shared formatter
            const startMin = parseTimeMin(props.timeRange.start);
            const endMin = parseTimeMin(props.timeRange.end);
            const dur = props.duration;

            for (let cur = startMin; cur + dur <= endMin; cur += 30) {
                times.push(formatTimeMin(cur, timeFormat.value as '12h' | '24h'));
            }
        } else {
            return null;
        }

        const todayStr = getTodayStr();
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        return times.filter(t => {
            const tMin = parseTimeMin(t);
            if (!props.allowPast && internalDateStr.value === todayStr && tMin < currentTime) return false;
            if (props.timeRange?.start && tMin < parseTimeMin(props.timeRange.start)) return false;
            if (props.timeRange?.end && tMin > parseTimeMin(props.timeRange.end)) return false;
            return true;
        });
    });

    const allowedHours = (hour: number) => {
        const todayStr = getTodayStr();
        const now = new Date();
        const currentH = now.getHours();

        // Prevent picking past hours if today is the selected date (unless allowPast)
        if (!props.allowPast && internalDateStr.value === todayStr && hour < currentH) return false;

        if (!props.timeRange) return true;

        // Start/End restrictions (24h based)
        const start = props.timeRange.start ? parseTimeMin(props.timeRange.start) : 0;
        const end = props.timeRange.end ? parseTimeMin(props.timeRange.end) : 1439;

        const startH = Math.floor(start / 60);
        const endH = Math.floor(end / 60);

        return hour >= startH && hour <= endH;
    };

    const allowedMinutes = (min: number) => {
        const todayStr = getTodayStr();
        const now = new Date();
        const currentH = now.getHours();
        const currentM = now.getMinutes();

        // If no time is selected yet, we can't restrict minutes based on a phantom hour
        // unless v-time-picker passes the currently *focused* hour.
        // Vuetify's allowed-minutes usually receives the currently active hour in its scope.
        // However, we only have internal state of 'selectedTime'.

        // Robustness: If we have a selected time, use its hour.
        const pickedTimeMin = selectedTime.value ? parseTimeMin(selectedTime.value) : -1;
        const pickedH = pickedTimeMin !== -1 ? Math.floor(pickedTimeMin / 60) : -1;

        // 1. Today restriction (unless allowPast)
        if (!props.allowPast && internalDateStr.value === todayStr && pickedH !== -1) {
            if (pickedH < currentH) return false;
            if (pickedH === currentH && min < currentM) return false;
        }

        // 2. Start/End range restriction
        if (!props.timeRange || pickedTimeMin === -1) return true;

        const start = props.timeRange.start ? parseTimeMin(props.timeRange.start) : 0;
        const end = props.timeRange.end ? parseTimeMin(props.timeRange.end) : 1439;

        const startH = Math.floor(start / 60);
        const endH = Math.floor(end / 60);
        const startM = start % 60;
        const endM = end % 60;

        if (pickedH === startH && pickedH === endH) return min >= startM && min <= endM;
        if (pickedH === startH) return min >= startM;
        if (pickedH === endH) return min <= endM;

        return true;
    };

    /**
     * Converts selectedTime (AM/PM display) to HH:mm for v-time-picker v-model.
     * Vuetify 3's v-time-picker always expects HH:mm regardless of display format.
     */
    const pickerTime = computed({
        get: (): string => {
            if (!selectedTime.value) return '';
            const min = parseTimeMin(selectedTime.value);
            return formatTimeHHmm(min);
        },
        set: (val: string) => {
            // val arrives from v-time-picker as HH:mm — convert to configured format for display
            if (!val) { selectedTime.value = ''; return; }
            const min = parseTimeMin(val);
            selectedTime.value = formatTimeMin(min, timeFormat.value as '12h' | '24h');
        }
    });

    // --- Time Picker Confirmation Logic ---
    const tempPickerTime = ref('');
    const pickerFormat = computed(() => timeFormat.value === '12h' ? 'ampm' : '24hr');

    // When menu opens, initialize temp value and handle smart default
    watch(menu2, (isOpen) => {
        if (isOpen) {
            if (pickerTime.value) {
                tempPickerTime.value = pickerTime.value;
            } else {
                // Smart Default: Find first allowed hour
                let min = 0;

                // If allowedTimesForDate (Fixed Slots or Duration-based) has values, pick first
                if (allowedTimesForDate.value && allowedTimesForDate.value.length > 0) {
                    const firstTime = allowedTimesForDate.value[0]; // e.g., "02:00 PM"
                    min = parseTimeMin(firstTime);
                }
                // Else if Range exists, pick start of range
                else if (props.timeRange?.start) {
                    min = parseTimeMin(props.timeRange.start);
                }
                // Else pick current time (or next 30 min block)
                else {
                    const now = new Date();
                    min = now.getHours() * 60 + now.getMinutes();
                }
                tempPickerTime.value = formatTimeHHmm(min);
            }
        }
    });

    function saveTime() {
        pickerTime.value = tempPickerTime.value;
        menu2.value = false;
    }

    function cancelTime() {
        menu2.value = false;
    }

    /** Called by v-time-picker @update:model-value — receives HH:mm, stores AM/PM. */
    function onPickerTimeUpdate(val: string) {
        // pickerTime.value = val; // Old immediate update
        tempPickerTime.value = val; // Update temp instead
    }

    // --- Date Picker Confirmation Logic ---
    const menu1 = ref(false);
    const tempDate = ref<Date | null>(null);

    // Initialize temp date when menu opens
    watch(menu1, (isOpen) => {
        if (isOpen) {
            tempDate.value = internalDate.value;
        }
    });

    function saveDate() {
        internalDate.value = tempDate.value;
        menu1.value = false;
    }

    function cancelDate() {
        menu1.value = false;
    }

    // --- Watchers Section ---

    // Auto-set single values
    watch(() => availableDates.value, (dates) => {
        if (dates.length === 1) internalDateStr.value = dates[0];
        else if (internalDateStr.value && dates.length > 0 && !dates.includes(internalDateStr.value)) {
            internalDateStr.value = null;
        }
    }, { immediate: true });

    watch(() => allowedTimesForDate.value, (times) => {
        if (times && times.length === 1) {
            selectedTime.value = times[0];
        } else if (times && times.length > 0 && !times.includes(selectedTime.value)) {
            // Current selection is not in the valid list — auto-select the first slot
            // instead of clearing to empty (an empty value causes the time picker to display NaN)
            selectedTime.value = times[0];
        }
    }, { immediate: true });

    // Sync internal state from props
    watch(() => props.date, (newDate) => {
        internalDateStr.value = newDate;
        const currentInternalDateStr = internalDate.value ? dateToYMD(internalDate.value) : null;
        if (newDate === currentInternalDateStr) return;

        if (newDate && newDate !== '') {
            const parts = newDate.split('-');
            if (parts.length === 3) {
                internalDate.value = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            }
        } else {
            internalDate.value = null;
        }
    }, { immediate: true });

    watch(() => props.time, v => { if (v !== selectedTime.value) selectedTime.value = v ?? '' });

    // Emit updates to parent
    watch(internalDateStr, (newVal) => {
        if (newVal !== props.date) emit('update:date', newVal);
    });

    watch(selectedTime, v => {
        if (v !== props.time) emit('update:time', v || null);
    });

    watch(internalDate, (newVal) => {
        const dateStr = newVal ? dateToYMD(newVal) : null;
        if (dateStr !== props.date) emit('update:date', dateStr);
    });

    return {
        menu1,
        menu2,
        selectedTime,
        pickerTime,
        tempPickerTime,
        tempDate,
        pickerFormat,
        saveTime,
        cancelTime,
        saveDate,
        cancelDate,
        onPickerTimeUpdate,
        internalDate,
        internalDateStr,
        availableDates,
        isAllowedDate,
        allowedTimesForDate,
        allowedHours,
        allowedMinutes
    };
}

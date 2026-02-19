import { ref, computed, watch, type Ref } from 'vue';
import { parseTimeMin, getTodayStr, dateToYMD } from '../utils/timeUtils';

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
    schedulingMode?: 'Standard' | 'Fixed Slots';
}

/**
 * Composable for DateTimePicker logic.
 * Encapsulates range filtering, auto-selection, and state synchronization.
 */
export function useDateTimePicker(props: DateTimePickerProps, emit: any) {
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
        if (!props.availableSlots || props.availableSlots.length === 0) return [];
        const todayStr = getTodayStr();
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        return props.availableSlots
            .filter(s => {
                if (s.date < todayStr) return false;
                if (props.dateRange?.start && s.date < props.dateRange.start) return false;
                if (props.dateRange?.end && s.date > props.dateRange.end) return false;

                // Today check: must have at least one future time
                if (s.date === todayStr) {
                    return s.times.some(t => parseTimeMin(t) >= currentTime);
                }
                return true;
            })
            .map(s => s.date);
    });

    /**
     * Validation function for v-date-input constraints.
     */
    const isAllowedDate = (val: any) => {
        const dateObj = (val instanceof Date) ? val : new Date(val);
        const dateStr = dateToYMD(dateObj);
        const todayStr = getTodayStr();

        if (dateStr < todayStr) return false;
        if (props.dateRange?.start && dateStr < props.dateRange.start) return false;
        if (props.dateRange?.end && dateStr > props.dateRange.end) return false;

        // Block if not in availableSlots
        if (props.availableSlots && props.availableSlots.length > 0 && !availableDates.value.includes(dateStr)) return false;

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
            times = slot.times;
        } else if (props.timeRange?.start && props.timeRange?.end && props.duration) {
            // Generate slots from range and duration
            const startMin = parseTimeMin(props.timeRange.start);
            const endMin = parseTimeMin(props.timeRange.end);
            const dur = props.duration;

            const format = (mTotal: number) => {
                let h = Math.floor(mTotal / 60);
                const m = mTotal % 60;
                const ampm = h >= 12 ? 'PM' : 'AM';
                h = h % 12;
                if (h === 0) h = 12;
                return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
            };

            for (let cur = startMin; cur + dur <= endMin; cur += 30) {
                times.push(format(cur));
            }
        } else {
            return null;
        }

        const todayStr = getTodayStr();
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        return times.filter(t => {
            const tMin = parseTimeMin(t);
            if (internalDateStr.value === todayStr && tMin < currentTime) return false;
            if (props.timeRange?.start && tMin < parseTimeMin(props.timeRange.start)) return false;
            if (props.timeRange?.end && tMin > parseTimeMin(props.timeRange.end)) return false;
            return true;
        });
    });

    const allowedHours = (hour: number) => {
        const todayStr = getTodayStr();
        const now = new Date();
        const currentH = now.getHours();

        // Prevent picking past hours if today
        if (internalDateStr.value === todayStr && hour < currentH) return false;

        if (!props.timeRange) return true;
        const start = props.timeRange.start ? parseTimeMin(props.timeRange.start) : 0;
        const end = props.timeRange.end ? parseTimeMin(props.timeRange.end) : 1439;
        return hour >= Math.floor(start / 60) && hour <= Math.floor(end / 60);
    };

    const allowedMinutes = (min: number) => {
        const todayStr = getTodayStr();
        const now = new Date();
        const currentM = now.getMinutes();
        const currentH = now.getHours();

        if (internalDateStr.value === todayStr && selectedTime.value) {
            const pickedH = Math.floor(parseTimeMin(selectedTime.value) / 60);
            if (pickedH < currentH) return false;
            if (pickedH === currentH && min < currentM) return false;
        }

        if (!props.timeRange || selectedTime.value === '') return true;
        const current = parseTimeMin(selectedTime.value);
        const pickedH = Math.floor(current / 60);
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

    // --- Watchers Section ---

    // Auto-set single values
    watch(() => availableDates.value, (dates) => {
        if (dates.length === 1) internalDateStr.value = dates[0];
        else if (internalDateStr.value && dates.length > 0 && !dates.includes(internalDateStr.value)) {
            internalDateStr.value = null;
        }
    }, { immediate: true });

    watch(() => allowedTimesForDate.value, (times) => {
        if (times && times.length === 1) selectedTime.value = times[0];
        else if (selectedTime.value && times && times.length > 0 && !times.includes(selectedTime.value)) {
            selectedTime.value = '';
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

    // Reset invalid time on date change
    watch(() => props.date, () => {
        if (allowedTimesForDate.value && selectedTime.value && !allowedTimesForDate.value.includes(selectedTime.value)) {
            selectedTime.value = '';
        }
    }, { immediate: true });

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
        menu2,
        selectedTime,
        internalDate,
        internalDateStr,
        availableDates,
        isAllowedDate,
        allowedTimesForDate,
        allowedHours,
        allowedMinutes
    };
}

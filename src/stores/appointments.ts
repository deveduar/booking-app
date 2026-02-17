import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { appointmentsData } from '@/data/initialData'

export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Canceled'

export type Appointment = {
  id: number
  date: string
  time: string
  service: string
  provider?: string
  status: AppointmentStatus
}

const STORAGE_KEY = 'salon_appointments'

export const useAppointmentsStore = defineStore('appointments', () => {
  const storedAppointments = localStorage.getItem(STORAGE_KEY)
  const appointments = ref<Appointment[]>(storedAppointments ? JSON.parse(storedAppointments) : appointmentsData)

  watch(
    appointments,
    (newAppointments) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAppointments))
    },
    { deep: true }
  )

  const upcoming = computed(() =>
    appointments.value.filter(appointment => appointment.status === 'Upcoming'),
  )

  function addAppointment(appointment: Omit<Appointment, 'id'>) {
    const nextId =
      appointments.value.reduce((max, current) => Math.max(max, current.id), 0) + 1
    appointments.value.push({ id: nextId, ...appointment })
  }

  function cancelAppointment(id: number) {
    appointments.value = appointments.value.map(appointment =>
      appointment.id === id ? { ...appointment, status: 'Canceled' } : appointment,
    )
  }

  return {
    appointments,
    upcoming,
    addAppointment,
    cancelAppointment,
  }
})


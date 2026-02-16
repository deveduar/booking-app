import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Canceled'

export type Appointment = {
  id: number
  date: string
  time: string
  service: string
  provider?: string
  status: AppointmentStatus
}

const initialAppointments: Appointment[] = [
  { id: 1, date: '2025-01-10', time: '10:00 AM', service: 'Consultation', provider: 'Alex', status: 'Upcoming' },
  { id: 2, date: '2025-01-08', time: '2:00 PM', service: 'Coloring', provider: 'Sophie', status: 'Completed' },
  { id: 3, date: '2025-01-06', time: '11:00 AM', service: 'General Service', provider: 'John', status: 'Canceled' },
  { id: 4, date: '2025-01-12', time: '3:00 PM', service: 'Session', provider: 'Emma', status: 'Upcoming' },
]

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>(initialAppointments)

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


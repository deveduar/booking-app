import type { Service } from '@/stores/services'
import type { Provider } from '@/stores/providers'
import type { Appointment } from '@/stores/appointments'

export const servicesData: Service[] = [
    {
        id: 1,
        name: 'Haircut',
        description: 'A stylish haircut tailored to your preferences.',
        price: 30,
        duration: 45,
        category: 'Haircuts',
        schedulingMode: 'Standard',
        timeRange: { start: '09:00', end: '18:00' }
    },
    {
        id: 4,
        name: 'Hair Coloring',
        description: 'Choose from a variety of hair colors and highlights.',
        price: 80,
        duration: 90,
        category: 'Coloring',
        schedulingMode: 'Standard',
        dateRange: { start: '2026-02-01', end: '2026-12-31' }
    },
    {
        id: 16,
        name: 'Masterclass: Advanced Highlights',
        description: 'A special workshop session with our top stylists.',
        price: 200,
        duration: 180,
        category: 'Coloring',
        schedulingMode: 'Fixed Slots',
        defaultProviderId: 1, // Alexa
        availableSlots: [
            { date: '2026-06-15', times: ['10:00', '14:00'] },
            { date: '2026-06-16', times: ['11:00'] }
        ],
        providerAvailability: {
            2: { // Renee's specific slots for this masterclass
                schedulingMode: 'Fixed Slots',
                availableSlots: [{ date: '2026-06-17', times: ['09:00'] }]
            }
        }
    },
    {
        id: 20,
        name: 'Weekend Workshop',
        description: 'A two-day intensive hair styling workshop.',
        price: 150,
        duration: 120,
        category: 'Haircuts',
        schedulingMode: 'Standard',
        dateRange: { start: '2026-05-01', end: '2026-05-31' },
        timeRange: { start: '10:00', end: '16:00' },
        providerAvailability: {
            1: { // Alexa's specific slots for this workshop
                schedulingMode: 'Fixed Slots',
                availableSlots: [
                    { date: '2026-05-10', times: ['09:00', '13:00'] },
                    { date: '2026-05-11', times: ['11:00'] }
                ]
            }
        }
    },
]

export const providersData: Provider[] = [
    {
        id: 1,
        name: 'Alexa',
        description: 'Specializes in modern cuts and color.',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/4d0bd9a4-2f47-4eeb-8fbf-5fb13eaf0a0b.png',
        serviceIds: [1, 4, 16, 20],
    },
    {
        id: 2,
        name: 'Renee',
        description: 'Expert in classic styles and treatments.',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/7cb6bea5-df1a-43ff-97c9-cc743fe8520d.png',
        serviceIds: [1, 16],
    },
    {
        id: 3,
        name: 'Samantha',
        description: 'Passionate about creative coloring.',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/014920d7-e0b4-4ffa-823a-811dd0d3cdbc.png',
        serviceIds: [1],
    },
]

export const appointmentsData: Appointment[] = [
    { id: 1, date: '2026-02-20', time: '10:00', service: 'Consultation', provider: 'Alex', status: 'Upcoming' },
    { id: 2, date: '2026-02-18', time: '14:00', service: 'Coloring', provider: 'Sophie', status: 'Completed' },
    { id: 3, date: '2026-02-16', time: '11:00', service: 'General Service', provider: 'John', status: 'Canceled' },
    { id: 4, date: '2026-02-22', time: '15:00', service: 'Session', provider: 'Emma', status: 'Upcoming' },
]

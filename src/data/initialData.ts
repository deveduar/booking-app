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
        timeRange: { start: '09:00 AM', end: '06:00 PM' }
    },
    {
        id: 4,
        name: 'Hair Coloring',
        description: 'Choose from a variety of hair colors and highlights.',
        price: 80,
        duration: 90,
        category: 'Coloring',
        schedulingMode: 'Standard',
        dateRange: { start: '2025-02-01', end: '2025-12-31' }
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
            { date: '2025-06-15', times: ['10:00 AM', '2:00 PM'] },
            { date: '2025-06-16', times: ['11:00 AM'] }
        ],
        providerAvailability: {
            2: { // Renee's specific slots for this masterclass
                schedulingMode: 'Fixed Slots',
                availableSlots: [{ date: '2025-06-17', times: ['09:00 AM'] }]
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
        dateRange: { start: '2025-05-01', end: '2025-05-31' },
        timeRange: { start: '10:00 AM', end: '04:00 PM' },
        providerAvailability: {
            1: { // Alexa's specific slots for this workshop
                schedulingMode: 'Fixed Slots',
                availableSlots: [
                    { date: '2025-05-10', times: ['09:00 AM', '01:00 PM'] },
                    { date: '2025-05-11', times: ['11:00 AM'] }
                ]
            }
        }
    },
]

export const providersData: Provider[] = [
    {
        id: 1,
        name: 'Alexa',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/4d0bd9a4-2f47-4eeb-8fbf-5fb13eaf0a0b.png',
        serviceIds: [1, 4, 16, 20],
    },
    {
        id: 2,
        name: 'Renee',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/7cb6bea5-df1a-43ff-97c9-cc743fe8520d.png',
        serviceIds: [1, 16],
    },
    {
        id: 3,
        name: 'Samantha',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/014920d7-e0b4-4ffa-823a-811dd0d3cdbc.png',
        serviceIds: [1],
    },
]

export const appointmentsData: Appointment[] = [
    { id: 1, date: '2025-01-10', time: '10:00 AM', service: 'Consultation', provider: 'Alex', status: 'Upcoming' },
    { id: 2, date: '2025-01-08', time: '2:00 PM', service: 'Coloring', provider: 'Sophie', status: 'Completed' },
    { id: 3, date: '2025-01-06', time: '11:00 AM', service: 'General Service', provider: 'John', status: 'Canceled' },
    { id: 4, date: '2025-01-12', time: '3:00 PM', service: 'Session', provider: 'Emma', status: 'Upcoming' },
]

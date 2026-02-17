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
    },
    {
        id: 2,
        name: 'Buzz Cut',
        description: 'A clean, short cut perfect for low maintenance.',
        price: 25,
        duration: 30,
        category: 'Haircuts',
    },
    {
        id: 3,
        name: 'Fade Cut',
        description: 'A fade haircut with a smooth gradient.',
        price: 35,
        duration: 40,
        category: 'Haircuts',
    },
    {
        id: 4,
        name: 'Hair Coloring',
        description: 'Choose from a variety of hair colors and highlights.',
        price: 80,
        duration: 90,
        category: 'Coloring',
    },
    {
        id: 5,
        name: 'Highlights',
        description: 'Add some highlights to brighten your hair.',
        price: 60,
        duration: 75,
        category: 'Coloring',
    },
    {
        id: 6,
        name: 'Balayage',
        description: 'A freehand hair color technique that creates a sun-kissed look.',
        price: 120,
        duration: 120,
        category: 'Coloring',
    },
    {
        id: 7,
        name: 'Deep Conditioning',
        description: 'A treatment to nourish and restore your hair.',
        price: 40,
        duration: 60,
        category: 'Treatments',
    },
    {
        id: 8,
        name: 'Keratin Treatment',
        description: 'A smoothing treatment to reduce frizz and enhance shine.',
        price: 150,
        duration: 120,
        category: 'Treatments',
    },
    {
        id: 9,
        name: 'Scalp Treatment',
        description: 'A soothing treatment to refresh and balance the scalp.',
        price: 50,
        duration: 45,
        category: 'Treatments',
    },
    {
        id: 10,
        name: 'Manicure',
        description: 'A treatment to shape and care for your nails.',
        price: 25,
        duration: 30,
        category: 'Nails',
    },
    {
        id: 11,
        name: 'Pedicure',
        description: 'A relaxing foot care treatment to pamper your feet.',
        price: 40,
        duration: 45,
        category: 'Nails',
    },
    {
        id: 12,
        name: 'Gel Nails',
        description: 'Long-lasting nails with a gel polish finish.',
        price: 50,
        duration: 60,
        category: 'Nails',
    },
    {
        id: 13,
        name: 'Swedish Massage',
        description: 'A gentle massage to relax your muscles and improve circulation.',
        price: 60,
        duration: 60,
        category: 'Massage',
    },
    {
        id: 14,
        name: 'Deep Tissue Massage',
        description: 'A more intense massage to target deeper layers of muscle.',
        price: 80,
        duration: 75,
        category: 'Massage',
    },
    {
        id: 15,
        name: 'Hot Stone Massage',
        description: 'A relaxing massage with warm stones for deep relaxation.',
        price: 90,
        duration: 90,
        category: 'Massage',
    },
    {
        id: 16,
        name: 'Masterclass: Advanced Highlights',
        description: 'A special workshop session with our top stylists.',
        price: 200,
        duration: 180,
        category: 'Coloring',
        defaultDate: '2025-03-15',
        defaultTime: '10:00 AM',
        defaultProviderId: 1, // Alexa
        availableSlots: [
            { date: '2025-03-15', times: ['10:00 AM', '2:00 PM'] },
            { date: '2025-03-16', times: ['11:00 AM'] }
        ]
    },
]

export const providersData: Provider[] = [
    {
        id: 1,
        name: 'Alexa',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/4d0bd9a4-2f47-4eeb-8fbf-5fb13eaf0a0b.png',
        serviceIds: [1, 2, 3, 4, 5, 6, 16], // Haircuts, Coloring & Masterclass
    },
    {
        id: 2,
        name: 'Renee',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/7cb6bea5-df1a-43ff-97c9-cc743fe8520d.png',
        serviceIds: [1, 7, 8, 9], // Haircut & Treatments
    },
    {
        id: 3,
        name: 'Samantha',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/014920d7-e0b4-4ffa-823a-811dd0d3cdbc.png',
        serviceIds: [10, 11, 12, 13, 14, 15], // Nails & Massage
    },
]

export const appointmentsData: Appointment[] = [
    { id: 1, date: '2025-01-10', time: '10:00 AM', service: 'Consultation', provider: 'Alex', status: 'Upcoming' },
    { id: 2, date: '2025-01-08', time: '2:00 PM', service: 'Coloring', provider: 'Sophie', status: 'Completed' },
    { id: 3, date: '2025-01-06', time: '11:00 AM', service: 'General Service', provider: 'John', status: 'Canceled' },
    { id: 4, date: '2025-01-12', time: '3:00 PM', service: 'Session', provider: 'Emma', status: 'Upcoming' },
]

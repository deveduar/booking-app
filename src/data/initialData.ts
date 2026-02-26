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
        dateRange: { start: '2026-01-01', end: '2026-12-31' },
        timeRange: { start: '09:00', end: '18:00' },
        isFeatured: true,
        isVisible: true
    },
    {
        id: 4,
        name: 'Hair Coloring',
        description: 'Choose from a variety of hair colors and highlights.',
        price: 80,
        duration: 90,
        category: 'Coloring',
        schedulingMode: 'Standard',
        dateRange: { start: '2026-02-01', end: '2026-12-31' },
        isFeatured: true,
        isVisible: true
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
        },
        isFeatured: true,
        isVisible: true
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
        },
        isVisible: true
    },
    {
        id: 21,
        name: 'Manicure & Pedicure',
        description: 'Complete nail care service.',
        price: 50,
        duration: 60,
        category: 'Nails',
        schedulingMode: 'Standard',
        dateRange: { start: '2026-01-01', end: '2026-12-31' },
        timeRange: { start: '10:00', end: '19:00' },
        defaultProviderId: 4,
        isVisible: true
    },
    {
        id: 22,
        name: 'Facial Treatment',
        description: 'Rejuvenating facial for all skin types.',
        price: 90,
        duration: 60,
        category: 'Skincare',
        schedulingMode: 'Standard',
        dateRange: { start: '2026-01-01', end: '2026-12-31' },
        timeRange: { start: '09:00', end: '17:00' },
        defaultProviderId: 5,
        isVisible: true
    }
]

export const providersData: Provider[] = [
    {
        id: 1,
        name: 'Alexa',
        description: 'Specializes in modern cuts and color.',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/4d0bd9a4-2f47-4eeb-8fbf-5fb13eaf0a0b.png',
        serviceIds: [1, 4, 16, 20],
        isFeatured: true,
    },
    {
        id: 2,
        name: 'Renee',
        description: 'Expert in classic styles and treatments.',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/7cb6bea5-df1a-43ff-97c9-cc743fe8520d.png',
        serviceIds: [1, 16],
        isFeatured: true,
    },
    {
        id: 3,
        name: 'Samantha',
        description: 'Passionate about creative coloring.',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/014920d7-e0b4-4ffa-823a-811dd0d3cdbc.png',
        serviceIds: [1],
        isFeatured: true,
    },
    {
        id: 4,
        name: 'Jessica',
        description: 'Nail art specialist with 5 years experience.',
        status: 'Available',
        image: 'https://cdn.usegalileo.ai/sdxl10/e360a77c-7c0b-4767-8765-573577507775.png',
        serviceIds: [21],
    },
    {
        id: 5,
        name: 'Michael',
        description: 'Skincare expert focusing on organic treatments.',
        status: 'Busy',
        image: 'https://cdn.usegalileo.ai/sdxl10/84725791-163e-42e1-a05a-277577507776.png',
        serviceIds: [22],
    }
]

export const appointmentsData: Appointment[] = []

export type UserRole = 'Admin' | 'User'

export type User = {
    id: number
    name: string
    email: string
    password?: string
    role: UserRole
    avatar?: string
}

export const usersData: User[] = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password',
        role: 'Admin',
        avatar: 'https://cdn.usegalileo.ai/sdxl10/84725791-163e-42e1-a05a-277577507776.png'
    },
    {
        id: 2,
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password',
        role: 'User',
        avatar: 'https://cdn.usegalileo.ai/sdxl10/014920d7-e0b4-4ffa-823a-811dd0d3cdbc.png'
    }
]

export const initialSettings = {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '12h' as '12h' | '24h',
    timezone: 'UTC',
    hero: {
        title: 'Glamour Salon',
        subtitle: 'Your go-to destination for premium hair care and styling.',
        images: [
            { src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            { src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            { src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        ],
        ctaText: 'Book Now',
        ctaLink: '/booking'
    },
    company: {
        brandName: 'YourBrand',
        footerText: 'Get connected with us on social networks!',
        socialLinks: [
            { platform: 'Facebook', url: '#', icon: 'mdi-facebook' },
            { platform: 'Twitter', url: '#', icon: 'mdi-twitter' },
            { platform: 'LinkedIn', url: '#', icon: 'mdi-linkedin' },
            { platform: 'Instagram', url: '#', icon: 'mdi-instagram' }
        ]
    }
}

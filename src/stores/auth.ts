import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { usersData } from '@/data/initialData'

export type UserRole = 'Admin' | 'User'

export type User = {
    id: number
    name: string
    email: string
    password?: string
    role: UserRole
    avatar?: string
}

const STORAGE_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)

    const isAuthenticated = computed(() => !!user.value)
    const isAdmin = computed(() => user.value?.role === 'Admin')

    function login(email: string, password: string): boolean {
        const foundUser = usersData.find(u => u.email === email && u.password === password)
        if (foundUser) {
            const { password: _, ...userData } = foundUser
            user.value = userData as User
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
            return true
        }
        return false
    }

    function register(newUser: Omit<User, 'id'>): boolean {
        const exists = usersData.some(u => u.email === newUser.email)
        if (exists) return false

        const userWithId: User = {
            ...newUser,
            id: usersData.length > 0 ? Math.max(...usersData.map(u => u.id)) + 1 : 1
        }

        // In a real app we'd push to the "database"
        // For now we'll just log them in
        user.value = userWithId
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
        return true
    }

    function logout() {
        user.value = null
        localStorage.removeItem(STORAGE_KEY)
    }

    function updateProfile(updatedData: Partial<User>) {
        if (user.value) {
            user.value = { ...user.value, ...updatedData }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
        }
    }

    return {
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile
    }
})

export const navItems = [
    { title: 'Home', label: 'Home', to: '/', icon: 'mdi-home', position: 'left' },
    { title: 'Booking', label: 'Booking', to: '/booking', icon: 'mdi-calendar-check', position: 'left', requiresAuth: true },
    { title: 'Services', label: 'Services', to: '/services', icon: 'mdi-clipboard-list-outline', position: 'left' },
    { title: 'Appointments', label: 'Appointments', to: '/appointments', icon: 'mdi-calendar-clock', position: 'left', requiresAuth: true },
    { title: 'Admin', label: 'Admin', to: '/admin', icon: 'mdi-shield-account', position: 'left', requiresAuth: true, role: 'Admin' },
    { title: 'Settings', label: 'Settings', to: '/settings', icon: 'mdi-cog', position: 'right', requiresAuth: true },
    { title: 'Sign In', label: 'Sign In', to: '/login', icon: 'mdi-login', position: 'right', guestOnly: true },
    { title: 'Sign Up', label: 'Sign Up', to: '/register', icon: 'mdi-account-plus', position: 'right', guestOnly: true },
    { title: 'About', label: 'About', to: '/about', icon: 'mdi-information-outline', position: 'right' },
];

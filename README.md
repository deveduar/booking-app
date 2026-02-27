# Idea Vue Dates - Salon Booking System

A modern, responsive Appointment Booking Application built with **Vue 3**, **TypeScript**, and **Vuetify**. This project serves as a comprehensive template for service-based businesses (like salons, barbershops, or consultancies) to manage appointments, services, and staff availability.

## 🚀 Tech Stack

- **Framework:** Vue 3 (Composition API, Script Setup)
- **Build Tool:** Vite
- **Language:** TypeScript
- **State Management:** Pinia
- **UI Framework:** Vuetify 3
- **Routing:** Vue Router 4
- **Testing:** Vitest (Unit), Cypress (E2E)
- **Linting:** ESLint + Prettier

## ✨ Key Features

### 📅 Booking System (`/booking`)
- **Interactive Calendar:** Users can select dates and view available time slots in real-time.
- **Conflict Detection:** Automatically filters out past times and respects provider-specific schedules.
- **Service Selection:** Choose from categorized services. Services can be marked as public/hidden.
- **Provider Selection:** Specialists are assigned to services. Users can see expert profiles and status.
- **Smart Flow:** Auto-selection of specialists and the next available slot for a seamless experience.

### 🛠️ Admin Dashboard (`/admin`)
- **Comprehensive Service Management:**
  - Create, edit, duplicate, and delete services.
  - Define pricing, duration, and categories.
  - **Visibility Control:** Toggle services as public or hidden.
- **Advanced Scheduling Engine:**
  - **Standard Mode:** Daily operating windows (e.g., 9:00 AM - 5:00 PM).
  - **Fixed Slots Mode:** Precise manual control over specific date/time combinations.
  - **Provider Overrides:** Custom schedules for any provider on any specific service, overriding business defaults.
- **Provider Management:**
  - Full CRUD for specialists with profiles and status tracking.
  - Granular service assignment.

### 💾 Data Resilience
- **Persistent Local Storage:** All state (Services, Providers, Appointments, Settings) is saved in `localStorage`.
- **Theme Support:** Fully responsive design with Dark/Light mode support.
- **Simulation Mode:** Pre-populated with rich sample data for immediate evaluation.

## 🚧 Current Status & Roadmap
- **Persistence:** Frontend-only. Data stays in the browser.
- **Auth:** Simulated authentication with 'Admin' and 'User' roles.
- **Collision Detection:** (Roadmap) Currently, availability is based on schedules. Real-time booking collision (preventing double-booking of the same slot) is a planned enhancement.
- **Provider Role:** (Roadmap) Adding a dedicated login for specialists to manage their own schedules.

## 🛠️ Project Setup

### 1. Install Dependencies
```sh
npm install
```

### 2. Run Development Server
```sh
npm run dev
```

### 3. Type-Check & Build for Production
```sh
npm run build
```

### 4. Run Tests
- **Unit Tests:** `npm run test:unit`
- **E2E Tests:** `npm run test:e2e:dev`
- **Production E2E Tests:** ``npm run test:e2e``
- **Lint** ``npm run lint``

## 📂 Project Structure

- `src/stores`: Pinia stores for centralized state (Services, Providers, Appointments).
- `src/views`: Main page views (Home, Booking, Admin, etc.).
- `src/components`: Reusable UI components.
  - `admin/`: specialized components for the admin panel (Forms, Slot Managers).
- `src/composables`: Shared logic hooks (e.g., `useDateTimePicker`, `useBooking`).
- `src/utils`: Helper functions for date/time manipulation.

## 📝 License
[MIT](LICENSE)

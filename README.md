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
- **Conflict Detection:** Automatically filters out past times and fully booked slots.
- **Service Selection:** Choose from categorized services with specific durations and prices.
- **Provider Selection:** Option to choose a specific specialist or "Any available".

### 🛠️ Admin Dashboard (`/admin`)
- **Service Management:**
  - Create, edit, and delete services.
  - Define pricing, duration, and categories.
  - **Flexible Scheduling Modes:**
    - **Standard:** Define daily operating hours (e.g., 9:00 AM - 5:00 PM).
    - **Fixed Slots:** Manually specify exact start times (e.g., 10:00 AM, 2:00 PM).
- **Provider Management:**
  - Add/Remove specialists.
  - Manage availability status (Available, Busy, Away).
- **Advanced Overrides:**
  - Configure unique schedules for specific providers on specific services.
  - Example: "Alice works 10-6 generally, but for 'Haircut' she only accepts 2-4 PM on Fridays."

### 💾 Data Persistence
- **Local Storage:** All data (services, providers, appointments) is persisted in the browser's `localStorage`.
- **Mock Data:** Initializes with a rich set of sample data (`src/data/initialData.ts`) for easy testing and demonstration.
- **No Backend Required:** The application runs entirely client-side, making it easy to deploy and test without setting up a server.

## 🚧 Current Status & Limitations

- **Backend:** This is a **frontend-only** application. Data is stored locally in the browser. Clearing browser cache will reset the application to its initial state.
- **Authentication:** Authentication views (`/login`, `/register`) are present but currently use simulated local authentication.
- **Time Zones:** Currently optimized for local time usage.
- **Performance:** Optimized for typical small-to-medium business data sets managed client-side.

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

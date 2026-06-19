# EventHub - Event Booking System Implementation Plan

EventHub is a full-stack event booking platform designed to provide a seamless event browsing, searching, and booking experience. The system is built with a React frontend, Node/Express backend, and MongoDB database. It features atomic booking logic (safeguarded against race conditions under concurrent load), real-time seat availability updates via WebSockets, and natural language semantic event search powered by the Groq API (LLaMA 3.3).

---

## Configuration & Environment Decisions

> [!IMPORTANT]
> - **MongoDB Connection**: A live MongoDB Atlas connection string will be provided by the user (no local MongoDB setup required).
> - **Groq API Key**: A Groq API key will be provided by the user for semantic search testing.
> - **Dependency Installation**: Use `npm ci` instead of `npm i` for all installations to ensure a safe, reproducible dependency tree based on lockfiles.
> - **Node & React versions**: Use latest stable releases.

---

## Proposed Changes

Here is a step-by-step plan broken down into 8 distinct implementation phases. Each phase concludes with a mandatory testing/verification plan before moving to the next.

### Phase 1: Project Scaffolding & Configuration
Initialize the monorepo workspace structure, set up package configurations, build tools, and set up the dev server proxy to handle frontend-to-backend requests seamlessly.

#### [NEW] [package.json](file:///d:/hiringProject/package.json) (Root monorepo workspace configuration)
#### [NEW] [backend/package.json](file:///d:/hiringProject/backend/package.json)
#### [NEW] [backend/.env.example](file:///d:/hiringProject/backend/.env.example)
#### [NEW] [backend/src/server.js](file:///d:/hiringProject/backend/src/server.js) (Express app bootstrap)
#### [NEW] [backend/src/app.js](file:///d:/hiringProject/backend/src/app.js) (Express application configurations and global middleware)
#### [NEW] [backend/src/config/env.js](file:///d:/hiringProject/backend/src/config/env.js) (Validated environment variable access)
#### [NEW] [frontend/package.json](file:///d:/hiringProject/frontend/package.json)
#### [NEW] [frontend/vite.config.js](file:///d:/hiringProject/frontend/vite.config.js) (Vite configuration with API proxy)
#### [NEW] [frontend/src/main.jsx](file:///d:/hiringProject/frontend/src/main.jsx)
#### [NEW] [frontend/src/App.jsx](file:///d:/hiringProject/frontend/src/App.jsx)
#### [NEW] [frontend/src/index.css](file:///d:/hiringProject/frontend/src/index.css) (CSS Design Tokens / Reset)

---

### Phase 2: Database Setup & Seed Scripts
Establish database connections, design Mongoose models for Users, Events, and Bookings, and create a data seed script to populate the database with mock events across categories.

#### [NEW] [backend/src/config/db.js](file:///d:/hiringProject/backend/src/config/db.js) (MongoDB client helper)
#### [NEW] [backend/src/models/User.js](file:///d:/hiringProject/backend/src/models/User.js)
#### [NEW] [backend/src/models/Event.js](file:///d:/hiringProject/backend/src/models/Event.js)
#### [NEW] [backend/src/models/Booking.js](file:///d:/hiringProject/backend/src/models/Booking.js)
#### [NEW] [backend/src/seed/seed.js](file:///d:/hiringProject/backend/src/seed/seed.js) (Database seeder file containing 20 demo events)

---

### Phase 3: JWT Authentication & User Management
Implement user registration and login endpoints, password hashing, and token-based stateful authentication. Create frontend authentication pages and a persistent Zustand store for JWT state.

#### [NEW] [backend/src/utils/ApiError.js](file:///d:/hiringProject/backend/src/utils/ApiError.js)
#### [NEW] [backend/src/utils/async-handler.js](file:///d:/hiringProject/backend/src/utils/async-handler.js)
#### [NEW] [backend/src/validators/auth.validator.js](file:///d:/hiringProject/backend/src/validators/auth.validator.js) (Zod verification schemas)
#### [NEW] [backend/src/middleware/validate.js](file:///d:/hiringProject/backend/src/middleware/validate.js)
#### [NEW] [backend/src/middleware/auth.middleware.js](file:///d:/hiringProject/backend/src/middleware/auth.middleware.js)
#### [NEW] [backend/src/services/auth.service.js](file:///d:/hiringProject/backend/src/services/auth.service.js)
#### [NEW] [backend/src/controllers/auth.controller.js](file:///d:/hiringProject/backend/src/controllers/auth.controller.js)
#### [NEW] [backend/src/routes/auth.routes.js](file:///d:/hiringProject/backend/src/routes/auth.routes.js)
#### [NEW] [frontend/src/api/client.js](file:///d:/hiringProject/frontend/src/api/client.js) (Axios configuration)
#### [NEW] [frontend/src/stores/authStore.js](file:///d:/hiringProject/frontend/src/stores/authStore.js) (Zustand persistent auth state)
#### [NEW] [frontend/src/components/layout/ProtectedRoute.jsx](file:///d:/hiringProject/frontend/src/components/layout/ProtectedRoute.jsx)
#### [NEW] [frontend/src/pages/LoginPage.jsx](file:///d:/hiringProject/frontend/src/pages/LoginPage.jsx)
#### [NEW] [frontend/src/pages/RegisterPage.jsx](file:///d:/hiringProject/frontend/src/pages/RegisterPage.jsx)

---

### Phase 4: Event Browsing & Detail Display
Implement paginated event fetching, category filtering, search endpoints, and design React views to browse events and display detailed event descriptions and seat statistics.

#### [NEW] [backend/src/controllers/event.controller.js](file:///d:/hiringProject/backend/src/controllers/event.controller.js)
#### [NEW] [backend/src/routes/event.routes.js](file:///d:/hiringProject/backend/src/routes/event.routes.js)
#### [NEW] [frontend/src/hooks/useEvents.js](file:///d:/hiringProject/frontend/src/hooks/useEvents.js)
#### [NEW] [frontend/src/hooks/useEventDetails.js](file:///d:/hiringProject/frontend/src/hooks/useEventDetails.js)
#### [NEW] [frontend/src/components/events/EventCard.jsx](file:///d:/hiringProject/frontend/src/components/events/EventCard.jsx)
#### [NEW] [frontend/src/pages/HomePage.jsx](file:///d:/hiringProject/frontend/src/pages/HomePage.jsx)
#### [NEW] [frontend/src/pages/EventPage.jsx](file:///d:/hiringProject/frontend/src/pages/EventPage.jsx)

---

### Phase 5: Atomic Booking Engine
Implement the core atomic booking transaction logic preventing double booking/race conditions, configure cancellation workflows, ownership middlewares, and client reservation screens.

#### [NEW] [backend/src/validators/booking.validator.js](file:///d:/hiringProject/backend/src/validators/booking.validator.js)
#### [NEW] [backend/src/middleware/ownership.js](file:///d:/hiringProject/backend/src/middleware/ownership.js)
#### [NEW] [backend/src/services/booking.service.js](file:///d:/hiringProject/backend/src/services/booking.service.js)
#### [NEW] [backend/src/controllers/booking.controller.js](file:///d:/hiringProject/backend/src/controllers/booking.controller.js)
#### [NEW] [backend/src/routes/booking.routes.js](file:///d:/hiringProject/backend/src/routes/booking.routes.js)
#### [NEW] [frontend/src/hooks/useBookings.js](file:///d:/hiringProject/frontend/src/hooks/useBookings.js)
#### [NEW] [frontend/src/components/bookings/BookingForm.jsx](file:///d:/hiringProject/frontend/src/components/bookings/BookingForm.jsx)
#### [NEW] [frontend/src/components/bookings/BookingCard.jsx](file:///d:/hiringProject/frontend/src/components/bookings/BookingCard.jsx)
#### [NEW] [frontend/src/pages/BookingsPage.jsx](file:///d:/hiringProject/frontend/src/pages/BookingsPage.jsx)

---

### Phase 6: Real-Time Seat Synchronization
Set up a Socket.IO connection between client and server, emit seat inventory updates on bookings and cancellations, and update client components in real-time.

#### [NEW] [backend/src/config/socket.js](file:///d:/hiringProject/backend/src/config/socket.js)
#### [NEW] [frontend/src/hooks/useSocket.js](file:///d:/hiringProject/frontend/src/hooks/useSocket.js)
#### [NEW] [frontend/src/components/events/SeatCounter.jsx](file:///d:/hiringProject/frontend/src/components/events/SeatCounter.jsx) (Animated progress indicator)

---

### Phase 7: AI Semantic Search integration
Create the Groq service for natural language query interpretation, map parsed filters onto MongoDB queries, and set up search entry fields.

#### [NEW] [backend/src/services/ai-search.service.js](file:///d:/hiringProject/backend/src/services/ai-search.service.js)
#### [NEW] [backend/src/validators/event.validator.js](file:///d:/hiringProject/backend/src/validators/event.validator.js)
#### [NEW] [frontend/src/hooks/useAISearch.js](file:///d:/hiringProject/frontend/src/hooks/useAISearch.js)
#### [NEW] [frontend/src/components/events/AISearchBar.jsx](file:///d:/hiringProject/frontend/src/components/events/AISearchBar.jsx)

---

### Phase 8: Premium UI, UX Polish & Cleanups
Refine visual assets, add glassmorphism designs, implement page-loading animations, empty page designs, responsive breakpoints, error boundary fallbacks, and compile deployment files.

#### [MODIFY] [frontend/src/index.css](file:///d:/hiringProject/frontend/src/index.css)
#### [NEW] [frontend/src/pages/NotFoundPage.jsx](file:///d:/hiringProject/frontend/src/pages/NotFoundPage.jsx)
#### [NEW] [README.md](file:///d:/hiringProject/README.md)

---

## Verification Plan

### Phase 1 Verification
* **Automated Tests**:
  * Execute `npm run dev` to verify workspace processes run without errors.
* **Manual Verification**:
  * Navigate to the client development server (typically `http://localhost:5173`) to confirm page loads.
  * Access the backend base path `/api/health` to confirm the gateway returns a `200 OK` health status.

### Phase 2 Verification
* **Automated Tests**:
  * Run the database seeding command `npm run seed` in the backend.
* **Manual Verification**:
  * Connect to MongoDB via shell or Compass to verify the presence of user, event, and booking collections.
  * Query the `events` collection to check that all 20 events are populated with correct field schemas and indexes.

### Phase 3 Verification
* **Automated Tests**:
  * Test validation constraints by submitting weak password registers or invalid emails to `/api/auth/register` (expect `400 Bad Request`).
* **Manual Verification**:
  * Submit a valid registration form. Verify that a success toast appears and you are redirected to the homepage.
  * Check the browser's `localStorage` to ensure the authentication token has been persisted.
  * Log out of the account, attempt to access `/bookings`, and check that you are redirected back to the login screen.

### Phase 4 Verification
* **Automated Tests**:
  * Send requests to `/api/events?page=1&limit=12` and verify the metadata structure for pagination.
* **Manual Verification**:
  * Browse the event grid on the homepage and toggle category pills; confirm only related events are loaded.
  * Click on a card, verify the route transitions to `/events/:id`, and check that detailed event parameters load correctly.

### Phase 5 Verification
* **Automated Tests**:
  * Write and run a script to launch 10 concurrent requests booking the final seat of an event to ensure only 1 booking succeeds and the rest return a `409 Conflict`.
* **Manual Verification**:
  * Authenticate, select a valid future event, and book 3 seats. Confirm that seat indicators decrement correctly.
  * Navigate to `/bookings`, click "Cancel booking", and confirm the booking changes to `cancelled` and the seats are restored in the database.

### Phase 6 Verification
* **Automated Tests**:
  * Connect multiple sockets to `/` and inspect WebSocket logs on seat change events.
* **Manual Verification**:
  * Open two separate browser tabs on the same event detail page.
  * Complete a booking in Tab A. Monitor Tab B to confirm the seat progress bar updates automatically without reloading.

### Phase 7 Verification
* **Automated Tests**:
  * Send mock requests to `/api/events/search` with the input `tech events next month`. Inspect the parsed JSON response body.
* **Manual Verification**:
  * Type a search query into the AI Search Bar. Check that appropriate filter tags appear and search results adjust instantly.

### Phase 8 Verification
* **Automated Tests**:
  * Execute production build command (`npm run build`) in the frontend and backend.
* **Manual Verification**:
  * Run lighthouse audits to verify SEO structure, performance metrics, and responsive screen scaling.
  * Access random invalid URLs to verify proper transition to the custom 404 screen.

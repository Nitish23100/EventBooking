# eventflow — Event Booking System

eventflow is a full-stack event discovery and booking platform built with a React frontend, Node/Express backend, and MongoDB database. It features responsive grid-based event discovery, theme contexts, custom on-brand form validation flows, and secure token-based user management.

---

## Project Setup

### Prerequisites
* **Node.js**: Version 18.0.0 or higher is required.
* **npm**: Version 9.0.0 or higher.
* **MongoDB**: A MongoDB connection string (Atlas is recommended).

### Installation & Initialization
This project is structured as a monorepo using npm workspaces. Follow these commands to run it locally:

1. **Bootstrap dependencies**:
   Installs both frontend and backend node modules using secure lockfile checking:
   ```bash
   npm run bootstrap
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory (see the [Environment Variables](#environment-variables) section below for details).

3. **Seed the database**:
   Populates the database with 20 demo events spanning categories like music, tech, comedy, and conferences:
   ```bash
   npm run seed
   ```

4. **Run in development mode**:
   Starts the Express server (port 5001) and Vite development client (port 5173) concurrently:
   ```bash
   npm run dev
   ```
   * Access the client application at: [http://localhost:5173](http://localhost:5173)
   * Access the backend APIs at: [http://localhost:5001](http://localhost:5001)

---

## Environment Variables

### Backend Environment Variables
Configure the following variables in a `.env` file inside the `backend` folder:

```ini
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Connection
MONGODB_URI=your_mongodb_connection_string

# Token Secrets
JWT_SECRET=your_jwt_secret_key_at_least_32_characters

# Client Origins
CORS_ORIGIN=http://localhost:5173

# AI Integrations (Required for Phase 7 search)
GROQ_API_KEY=your_groq_api_key
```

### Frontend Environment Variables
Configure the following variable in your frontend hosting environment (e.g., Vercel) or locally in `frontend/.env`:

```ini
# API Connection
VITE_API_URL=https://your-backend.onrender.com/api
```
*Note: In local development, if this is not set, the frontend will securely fall back to using the relative `/api` path, which is automatically intercepted by the Vite development proxy and forwarded to your local backend server.*

---

## API Documentation

### 1. Health Status
* **`GET /api/health`**
  * Check server connectivity.
  * **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Server is healthy",
      "data": {
        "timestamp": "2026-06-19T13:30:00.000Z",
        "uptime": 12.34
      }
    }
    ```

### 2. User Authentication
* **`POST /api/auth/register`**
  * Register a new user profile.
  * **Payload**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "Password123!"
    }
    ```
  * **Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "user": {
          "_id": "603d2e...",
          "name": "John Doe",
          "email": "john@example.com",
          "createdAt": "...",
          "updatedAt": "..."
        },
        "token": "eyJhbGciOi..."
      }
    }
    ```

* **`POST /api/auth/login`**
  * Authenticate and retrieve user JWT.
  * **Payload**:
    ```json
    {
      "email": "john@example.com",
      "password": "Password123!"
    }
    ```
  * **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "User logged in successfully",
      "data": {
        "user": {
          "_id": "603d2e...",
          "name": "John Doe",
          "email": "john@example.com",
          "createdAt": "...",
          "updatedAt": "..."
        },
        "token": "eyJhbGciOi..."
      }
    }
    ```

* **`GET /api/auth/me`**
  * Retrieve profile details for the active session.
  * **Headers**: `Authorization: Bearer <token>`
  * **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "User profile retrieved successfully",
      "data": {
        "user": {
          "_id": "603d2e...",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    }
    ```

### 3. Events Discovery
* **`GET /api/events`**
  * Query upcoming events with support for paging, search keywords, and categories.
  * **Query Parameters**:
    * `page` (default: 1)
    * `limit` (default: 12)
    * `category` (optional, filter e.g. `music`, `tech`)
    * `search` (optional search keyword)
  * **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Events retrieved successfully",
      "data": {
        "events": [...],
        "pagination": {
          "total": 20,
          "page": 1,
          "pages": 2,
          "limit": 12
        }
      }
    }
    ```

* **`GET /api/events/:id`**
  * Fetch details and seat parameters for an individual event.
  * **Response (200 OK)**: Returns the single event document or `404 Not Found` if the ID is invalid.

* **`POST /api/events/search`**
  * Perform an AI-powered semantic search across events using Groq.
  * **Payload**:
    ```json
    {
      "query": "tech conferences with networking"
    }
    ```
    *(Note: `query` must be between 3 and 200 characters).*
  * **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "AI Search completed successfully",
      "data": {
        "filters": {
          "category": "tech",
          "keyword": "networking",
          "dateFrom": null,
          "dateTo": null
        },
        "events": [
          {
            "_id": "603d2e...",
            "name": "Tech Innovators Summit",
            "category": "tech",
            "date": "2026-08-15T09:00:00.000Z"
          }
        ],
        "total": 1
      }
    }
    ```

### 4. Bookings API
* **`POST /api/bookings`**
  * Create a new booking for an event.
  * **Headers**: `Authorization: Bearer <token>`
  * **Payload**:
    ```json
    {
      "eventId": "603d2e...",
      "seats": 2
    }
    ```
  * **Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Booking created successfully",
      "data": {
        "booking": { ... }
      }
    }
    ```

* **`GET /api/bookings/me`**
  * Retrieve all bookings for the currently authenticated user.
  * **Headers**: `Authorization: Bearer <token>`
  * **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "User bookings retrieved successfully",
      "data": {
        "bookings": [ ... ]
      }
    }
    ```

* **`DELETE /api/bookings/:id`**
  * Cancel a specific booking. Verifies that the booking belongs to the requesting user.
  * **Headers**: `Authorization: Bearer <token>`
  * **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Booking cancelled successfully",
      "data": {
        "booking": { ... }
      }
    }
    ```

---

## Real-Time Architecture

The platform utilizes **Socket.io** to provide real-time seat availability updates. This ensures users see live capacity changes without needing to refresh the page when other users book or cancel seats.

* **Connection**: The Socket.io client connects to the backend root URL (derived dynamically from `VITE_API_URL` with the `/api` path stripped). Locally, it connects via the Vite development proxy.
* **Room Management**: When a user views an event page, the client emits a `joinEvent` event with the `eventId` to join a specific socket room. Upon leaving the page, it emits `leaveEvent`.
* **Live Updates**: Upon any successful booking creation or cancellation, the backend service emits a `seatUpdate` event (containing the `eventId` and the newly updated `availableSeats` count) exclusively to the users currently active in that specific event's room.

---

## Assumptions

1. **Authentication**: Assumed stateless JWT authentication is sufficient and preferred over stateful session cookies for this assessment.
2. **Search Capability**: Assumed basic text search only needs to match against the event name and description, with AI semantic search added as an enhancement.
3. **Location Processing**: Assumed static location names are sufficient for the venue field without requiring full geocoding or interactive map integrations.
4. **Logout Mechanism**: Assumed client-side token deletion is sufficient for logout without requiring a backend token blacklist.

---

## Design Decisions

1. **Monorepo Structure**: A monorepo layout using `npm workspaces` facilitates code organization and allows a single command (`npm run dev`) to orchestrate both the frontend and backend servers.
2. **Custom Client-Side Form Validation (Section 9.9)**:
   * Native HTML5 tooltips and outlines are disabled using `noValidate` on forms to prevent browser styling inconsistencies.
   * Field checking is done on blur, and on keystroke *after* an error is displayed.
   * On submit failure, the first invalid input receives focus, smooth-scrolls into view, and executes a visual CSS shake animation.
   * Success states display green checkmarks inline to confirm validity.
3. **Tailwind Themes**: CSS tokens configured in [tokens.css](frontend/src/styles/tokens.css) map to Vite configurations, allowing smooth dark-to-light theme transitions without full page flashes.
4. **Zustand Auth Store**: We decoupled API logic from components by implementing a persistent Zustand auth store that synchronizes the session token in local storage and attaches it to outgoing Axios requests via HTTP interceptors.
5. **Direct API Communication in Production**: In production, the frontend is configured to communicate directly with the backend (e.g., Render) across origins using the `VITE_API_URL` environment variable (and authorized via the backend's `CORS_ORIGIN`). This avoids proxying requests through the frontend hosting provider (like Vercel), resulting in lower latency, simpler debugging, and the elimination of an unnecessary infrastructure layer.

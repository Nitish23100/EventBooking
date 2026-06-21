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
   Starts the Express server (port 5000) and Vite development client (port 5173) concurrently:
   ```bash
   npm run dev
   ```
   * Access the client application at: [http://localhost:5173](http://localhost:5173)
   * Access the backend APIs at: [http://localhost:5000](http://localhost:5000)

---

## Environment Variables

Configure the following variables in a `.env` file inside the `backend` folder:

```ini
# Server Configuration
PORT=5000
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
  * **Response (200 OK)**: Returns user info and signed session JWT.

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

---

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

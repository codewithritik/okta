# Okta Users & Devices Service

Node.js/Express service to fetch users and their enrolled MFA devices from Okta.

### Features
- Fetch Okta users with pagination and optional filtering
- Fetch a single user by ID
- Fetch a user’s enrolled factors/devices
- Combined endpoint: user profile with devices
- Health check with Okta connectivity verification
- Consistent JSON responses and error handling
- CORS enabled, Axios timeouts, and dotenv-based configuration

### Prerequisites
- Node.js 18+ and npm
- An Okta tenant with an API token

### Environment Variables
Create a `.env` file in the project root with:

```
OKTA_DOMAIN=https://your-okta-domain.okta.com
OKTA_API_TOKEN=your_api_token
PORT=3000
```

Notes:
- `OKTA_DOMAIN` must include protocol and no trailing slash.
- `PORT` is optional (defaults to 3000).

Alternatively, copy the example file:
```bash
cp .env.example .env
```

### Install
```bash
npm install
```

### Run
- Development (auto-reload):
```bash
npm run dev
```

- Production:
```bash
npm start
```

Server prints helpful URLs on start:
- Health: `http://localhost:PORT/health`
- Users API root: `http://localhost:PORT/api/users`
- Swagger UI: `http://localhost:PORT/api-docs`

### API

Base URL: `http://localhost:PORT`

- GET `/health`
  - Returns service status and Okta connectivity.

- GET `/api/users`
  - Query params: `limit` (number), `after` (cursor), `filter` (Okta user filter).
  - Example:
    ```bash
    curl "http://localhost:3000/api/users?limit=10"
    ```

- GET `/api/users/:userId`
  - Returns a user profile with their devices.
  - Example:
    ```bash
    curl http://localhost:3000/api/users/00u123EXAMPLE
    ```

- GET `/api/users/:userId/devices`
  - Returns enrolled factors/devices for the user.
  - Example:
    ```bash
    curl http://localhost:3000/api/users/00u123EXAMPLE/devices
    ```

### Responses

- Users list
```json
{
  "success": true,
  "data": [
    {
      "id": "00u123...",
      "status": "ACTIVE",
      "created": "2023-01-01T00:00:00Z",
      "activated": "2023-01-01T00:00:00Z",
      "lastLogin": "2024-01-10T12:00:00Z",
      "profile": {
        "firstName": "Ada",
        "lastName": "Lovelace",
        "email": "ada@example.com",
        "login": "ada@example.com"
      }
    }
  ],
  "pagination": {
    "hasNext": false,
    "nextCursor": null,
    "totalCount": 1
  }
}
```

- User with devices
```json
{
  "success": true,
  "data": {
    "user": { "id": "00u123...", "profile": { "email": "..." } },
    "devices": [
      {
        "id": "opf123...",
        "factorType": "token:software:totp",
        "provider": "OKTA",
        "status": "ACTIVE",
        "created": "2023-01-01T00:00:00Z",
        "lastUpdated": "2024-01-10T12:00:00Z",
        "profile": {}
      }
    ],
    "deviceCount": 1
  }
}
```

### Error Handling
- `404` when a user is not found.
- `503` on `/health` if Okta is unreachable or auth fails.
- `500` for unexpected errors.

### Project Structure
```
config/okta.js          # Loads env and builds Okta base URL
services/oktaService.js # Okta API client and helpers
controllers/userController.js # Request handlers
routes/userRoutes.js    # Users routes with Swagger JSDoc
routes/index.js         # Central router (mounts /api/users and /health)
swagger.js              # Swagger UI and swagger-jsdoc setup
server.js               # App bootstrap and middleware
```

### Security
- Keep `.env` out of version control (covered by `.gitignore`).
- Use a restricted-scope Okta API token.

### License
MIT

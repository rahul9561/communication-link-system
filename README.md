# Communication Link Management System

A full-stack application for tracking and managing client communication links with real-time updates and activity logs.

## Tech Stack

**Backend:**
- Node.js (Native HTTP module - No Express)
- MySQL 2
- RESTful API

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Lucide React Icons

## Project Structure

```
communication-link-management/
├── backend/
│   ├── server.js
│   ├── init-database.js
│   ├── schema.sql
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone or Create Project Directory

```bash
mkdir communication-link-management
cd communication-link-management
```

### 2. Backend Setup

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize npm and install dependencies
npm init -y
npm install mysql2
npm install --save-dev nodemon

# Create server files
# Copy server.js, init-database.js, schema.sql from artifacts

# Update database credentials in server.js and init-database.js
# Change 'your_password' to your MySQL root password
```

### 3. Database Setup

```bash
# Make sure MySQL is running
# Then initialize the database
npm run init-db
```

This will:
- Create the `communication_links_db` database
- Create `communication_links` and `activity_logs` tables
- Insert sample data

### 4. Frontend Setup

```bash
# Go back to root directory
cd ..

# Create Vite React app
npm create vite@latest frontend -- --template react
cd frontend

# Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react

# Initialize Tailwind
npx tailwindcss init -p

# Copy configuration files and App.jsx from artifacts
```

### 5. Configure Frontend Files

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**src/main.jsx:**
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**index.html:**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Communication Link Manager</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend
npm start

# Or with nodemon for development
npm run dev
```

Backend will run on: `http://localhost:3000`

### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

## API Endpoints

### Communication Links

- `GET /api/links` - Get all communication links
- `GET /api/links/:id` - Get a specific link
- `POST /api/links` - Create a new link
- `PUT /api/links/:id` - Update a link
- `DELETE /api/links/:id` - Delete a link

### Activity Logs

- `GET /api/logs` - Get all activity logs
- `GET /api/logs/:linkId` - Get logs for a specific link

## API Request Examples

### Create a New Link

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Example Corp",
    "clientEmail": "contact@example.com",
    "linkType": "email",
    "linkUrl": "contact@example.com",
    "status": "active",
    "description": "Primary contact"
  }'
```

### Update a Link

```bash
curl -X PUT http://localhost:3000/api/links/1 \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Example Corp Updated",
    "clientEmail": "info@example.com",
    "linkType": "email",
    "linkUrl": "info@example.com",
    "status": "active",
    "description": "Updated contact"
  }'
```

### Delete a Link

```bash
curl -X DELETE http://localhost:3000/api/links/1
```

## Features

✅ **Link Management**
- Create, read, update, and delete communication links
- Support for multiple link types (Email, Slack, Teams, Phone, Other)
- Active/Inactive status toggle
- Client information tracking

✅ **Activity Logging**
- Automatic logging of all actions
- Timestamped activity records
- Detailed activity history

✅ **Real-time Updates**
- Automatic UI refresh after operations
- Live statistics dashboard
- Instant feedback on actions

✅ **Modern UI**
- Responsive design with Tailwind CSS
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Intuitive modal dialogs

## Database Schema

### communication_links Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment primary key |
| client_name | VARCHAR(255) | Client name |
| client_email | VARCHAR(255) | Client email |
| link_type | ENUM | Type of communication link |
| link_url | VARCHAR(500) | Link URL or contact info |
| status | ENUM | Active or inactive status |
| description | TEXT | Additional description |
| created_at | TIMESTAMP | Creation timestamp |
| last_updated | TIMESTAMP | Last update timestamp |

### activity_logs Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment primary key |
| link_id | INT (FK) | Reference to communication link |
| action | ENUM | Type of action performed |
| details | TEXT | Action details |
| timestamp | TIMESTAMP | Action timestamp |

## Troubleshooting

### MySQL Connection Error

If you get a connection error:
1. Ensure MySQL server is running
2. Check username and password in `server.js` and `init-database.js`
3. Verify MySQL is listening on port 3306

### Port Already in Use

If port 3000 or 5173 is in use:
- Backend: Change PORT in `server.js`
- Frontend: Change port in `vite.config.js`

### CORS Issues

CORS is configured to allow all origins (`*`). For production, update the `Access-Control-Allow-Origin` header in `server.js` to your specific domain.

## Production Build

### Build Frontend

```bash
cd frontend
npm run build
```

The production-ready files will be in `frontend/dist/`

### Deploy

- Deploy backend on any Node.js hosting (AWS, DigitalOcean, Heroku)
- Deploy frontend build on any static hosting (Vercel, Netlify, AWS S3)
- Update API_BASE URL in frontend for production

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
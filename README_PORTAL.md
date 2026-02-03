# VOLOREIS Portal System

Complete customer and admin portal implementation with live GPS tracking, emergency features, and safety monitoring.

## 🚀 Features

### Customer Portal (/portal)
- **Trip Management**: View itinerary, plan details, and trip length
- **Safety Preferences**: Configure email/SMS notifications and check-in settings
- **Live GPS Tracking**: Real-time location sharing with consent management
- **Emergency Button**: One-click emergency alert system
- **Chat Integration**: Stub for customer support chat
- **Location Fallback**: IP-based location when GPS unavailable

### Admin Portal (/admin)
- **Active Traveler Monitoring**: View all monitored travelers
- **Real-time Locations**: See last known GPS positions
- **Auto-refresh**: 10-second polling for live updates
- **Trip Details**: Destination, plan, length, and status

## 📁 Project Structure

```
├── src/
│   ├── portal/
│   │   ├── auth.js              # Session management
│   │   ├── api.js               # API client
│   │   ├── ProtectedRoute.jsx   # Route protection
│   │   ├── locationService.js   # GPS tracking service
│   │   ├── CustomerLogin.jsx    # Customer login page
│   │   ├── CustomerPortal.jsx   # Customer dashboard
│   │   ├── AdminLogin.jsx       # Admin login page
│   │   └── AdminPortal.jsx      # Admin dashboard
│   ├── App.js                   # Main app with routes
│   └── index.js                 # Entry point
├── server/
│   ├── index.js                 # Express backend API
│   └── package.json             # Server dependencies
├── .env                         # Environment variables
└── .env.example                 # Environment template
```

## 🛠️ Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` (already done):

```bash
# Frontend API URL
VITE_API_BASE=http://localhost:8080
```

For production (Vercel):
```bash
VITE_API_BASE=https://your-api-domain.com
```

### 4. Start the Backend Server

```bash
cd server
npm start
```

Server runs on: http://localhost:8080

### 5. Start the Frontend

In a new terminal:

```bash
npm run dev
```

Frontend runs on: http://localhost:5173 (or your configured port)

## 🔐 Test Accounts

### Customer Account
- **Email**: customer@voloreis.com
- **Password**: password123
- **Login URL**: http://localhost:5173/portal/login

### Admin Account
- **Email**: admin@voloreis.com
- **Password**: adminpassword
- **Login URL**: http://localhost:5173/admin/login

## 📱 Routes

### Public Routes
- `/` - Homepage
- `/plans` - Plans page
- `/checkout` - Checkout page

### Customer Routes
- `/portal/login` - Customer login
- `/portal` - Customer dashboard (protected)

### Admin Routes
- `/admin/login` - Admin login
- `/admin` - Admin dashboard (protected)

## 🎯 API Endpoints

### Authentication
- `POST /auth/login` - User login

### Customer Portal
- `GET /me` - Get user profile
- `POST /me/preferences` - Update preferences

### Admin Portal
- `GET /admin/active` - Get active travelers
- `GET /admin/locations` - Get all locations

### Location Tracking
- `POST /location/update` - Update GPS location
- `POST /location/stop` - Stop tracking
- `GET /location/ip-approx` - IP-based location fallback

### Emergency
- `POST /emergency/trigger` - Trigger emergency alert

### Health
- `GET /health` - Health check

## 🔧 Technical Details

### Frontend Stack
- React 18
- React Router v6
- Material-UI (MUI)
- Vite (build tool)

### Backend Stack
- Node.js
- Express.js
- CORS enabled
- In-memory storage (replace with database in production)

### GPS Tracking Features
- High accuracy mode enabled
- 15-second timeout
- 5-second max age
- 5-second update interval
- Automatic retry on error
- Last-known location storage
- IP fallback when GPS unavailable

### Security
- JWT-like token authentication
- Protected routes with role-based access
- LocalStorage for session management
- CORS configured for development

## 🚢 Deployment

### Vercel (Frontend)

1. **Set Environment Variable** in Vercel Dashboard:
   ```
   VITE_API_BASE=https://your-api-domain.com
   ```

2. **Deploy**:
   ```bash
   npm run build
   vercel deploy
   ```

### Backend (Server)

Deploy to any Node.js hosting provider (Railway, Render, Heroku, etc.):

1. **Set PORT** environment variable (default: 8080)
2. **Deploy** the `/server` directory
3. **Update VITE_API_BASE** to point to your deployed API

## 📝 Notes

### Current Limitations (MVP)
- In-memory storage (data resets on server restart)
- No persistent database
- No real SMS/email integration
- Chat UI is a stub
- IP location is simulated

### Production Recommendations
- Replace in-memory storage with PostgreSQL/MongoDB
- Implement proper JWT authentication
- Add rate limiting
- Implement real SMS/email (Twilio, SendGrid)
- Add WebSocket for real-time updates
- Implement proper logging
- Add comprehensive error handling
- Set up monitoring and alerts
- Use HTTPS in production

## 🤝 Contributing

This is a complete MVP implementation. Extend as needed for production use.

## 📄 License

Proprietary - VOLOREIS
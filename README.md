# 🛡️ Cybersecurity Attack Simulation Dashboard

A real-time monitoring system designed to simulate, visualize, analyze, and manage cyberattacks in a controlled environment, mimicking how real Security Operations Centers (SOC) detect and track network threats.

![Dashboard Preview](docs/dashboard-preview.png)

## 🚀 Features

### Authentication System
- ✅ User registration and login with email/password
- ✅ Password hashing using bcryptjs (salt rounds: 10)
- ✅ JWT token-based authentication (24h expiration)
- ✅ Role-based access control (admin vs analyst)
- ✅ Protected routes on frontend
- ✅ Token stored in localStorage

### Attack Simulation Engine
- ✅ 10 different attack types simulation
- ✅ Configurable intensity levels (Low/Medium/High/Extreme)
- ✅ Realistic IP generation (internal, external, malicious ranges)
- ✅ Severity-weighted attack generation
- ✅ Real-time log streaming

### Real-Time WebSocket Pipeline
- ✅ Socket.io integration for live updates
- ✅ `log:new` event for streaming attack logs
- ✅ `simulation:status` and `simulation:stats` events
- ✅ Auto-reconnection handling
- ✅ Connection status indicator

### Dashboard
- ✅ Real-time attack timeline chart
- ✅ Severity distribution pie chart
- ✅ Attack type distribution bar chart
- ✅ Live scrolling log feed (last 50 logs)
- ✅ Status indicators and attack rate display

### Logs Management
- ✅ Paginated table with all attack logs
- ✅ Server-side filtering (IP, type, severity, time range)
- ✅ Sorting by timestamp
- ✅ Export to CSV functionality

### Analytics
- ✅ Total attacks count
- ✅ Attacks per type visualization
- ✅ Severity distribution
- ✅ Most targeted IPs
- ✅ Protocol usage distribution
- ✅ Time range selector

### Admin Panel (Admin only)
- ✅ Start/Stop simulation toggle
- ✅ Attack intensity slider
- ✅ Toggle individual attack types
- ✅ Clear all logs
- ✅ System reset option
- ✅ User management

## 🛠️ Tech Stack

### Frontend
- **Vite + React** - Fast development and build
- **TailwindCSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js + Express** - Server framework
- **Socket.io** - WebSocket implementation
- **MongoDB + Mongoose** - Database
- **bcryptjs** - Password hashing
- **JWT** - Token authentication
- **Helmet.js** - Security headers
- **express-rate-limit** - Rate limiting

## 📁 Project Structure

```
├── client/                    # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── store/             # Zustand state management
│   │   ├── services/          # API & Socket.io clients
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # Helper functions
│   ├── Dockerfile
│   └── package.json
├── server/                    # Backend (Node.js + Express)
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routes
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth & role middleware
│   ├── simulation/            # Attack simulation engine
│   ├── socket/                # WebSocket handlers
│   ├── config/                # Configuration
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 7+
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cybersecurity-dashboard.git
cd cybersecurity-dashboard
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Install and run the backend**
```bash
cd server
npm install
npm run seed    # Create default users
npm run dev     # Start server on port 5000
```

4. **Install and run the frontend**
```bash
cd client
npm install
npm run dev     # Start client on port 5173
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Docker Deployment

```bash
# Start all services
docker-compose up -d

# Seed the database
docker-compose exec backend npm run seed

# View logs
docker-compose logs -f
```

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@security.com | Admin123! |
| Analyst | analyst@security.com | Analyst123! |

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/users` | Get all users (admin) |
| PUT | `/api/auth/users/:id/role` | Update user role (admin) |

### Simulation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/simulation/start` | Start simulation (admin) |
| POST | `/api/simulation/stop` | Stop simulation (admin) |
| GET | `/api/simulation/status` | Get simulation status |
| PUT | `/api/simulation/settings` | Update settings (admin) |
| POST | `/api/simulation/reset` | Reset simulation (admin) |

### Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs` | Get logs with pagination/filters |
| GET | `/api/logs/:id` | Get single log |
| DELETE | `/api/logs/:id` | Delete log (admin) |
| DELETE | `/api/logs` | Clear all logs (admin) |
| GET | `/api/logs/export` | Export logs to CSV |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Get summary stats |
| GET | `/api/analytics/by-type` | Attacks by type |
| GET | `/api/analytics/by-severity` | Attacks by severity |
| GET | `/api/analytics/by-ip` | Most targeted IPs |
| GET | `/api/analytics/timeline` | Attack timeline |
| GET | `/api/analytics/by-protocol` | Protocol distribution |

## 🔒 Security Features

- Password hashing with bcryptjs (salt rounds: 10)
- JWT tokens with 24-hour expiration
- Role-based access control middleware
- CORS configuration
- Rate limiting on auth routes (100 requests/15 minutes)
- Input validation with express-validator
- Helmet.js for HTTP security headers

## 🎨 UI/UX Features

- Dark theme (cybersecurity aesthetic)
- Color-coded severity levels:
  - 🔴 Critical: Red
  - 🟠 High: Orange
  - 🟡 Medium: Yellow
  - 🟢 Low: Green
- Smooth animations for real-time updates
- Responsive design for all screen sizes
- Loading states and error handling

## 📊 Attack Types

| Attack Type | Severity Range | Protocols |
|-------------|---------------|-----------|
| Port Scan | Low-Medium | TCP, UDP |
| DDoS Spike | High-Critical | TCP, UDP, ICMP |
| Bruteforce Login | Medium-High | HTTP, HTTPS |
| SQL Injection Attempt | Medium-Critical | HTTP, HTTPS |
| Malware File Modification | Medium-Critical | TCP, HTTP |
| Unauthorized Access Attempt | Low-High | TCP, HTTP, HTTPS |
| Ransomware Encryption Attempt | High-Critical | TCP |
| XSS Attack | Low-High | HTTP, HTTPS |
| Man-in-the-Middle Attack | Medium-Critical | TCP, HTTP |
| Phishing Attempt | Medium-High | HTTP, HTTPS |

## 📈 Intensity Levels

| Level | Rate |
|-------|------|
| Low | 1 log per 2 seconds |
| Medium | 1 log per second |
| High | 5 logs per second |
| Extreme | 20+ logs per second |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by real SOC dashboards
- Built for educational and demonstration purposes
- Icons from Emoji standard
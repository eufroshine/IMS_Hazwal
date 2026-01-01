# Hazwal Inventory System

Chemical inventory management system with real-time delivery tracking, fleet management, analytics reports, and notifications. Built with .NET Core and Next.js.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Features

- **Dashboard** - Real-time inventory statistics and visual analytics
- **Chemical Management** - Complete CRUD operations for chemical products with categories and stock tracking
- **Delivery Tracking** - Monitor delivery status and fleet location in real-time
- **Fleet Management** - Manage vehicles, drivers, and maintenance schedules
- **Reports & Analytics** - Generate detailed reports with data visualization
- **Notifications** - Real-time alerts for important system events
- **Admin Settings** - System configuration and user management

## Tech Stack

### Backend
- .NET 9.0 (ASP.NET Core)
- C#
- Entity Framework Core
- REST API Architecture

### Frontend
- Next.js 15+
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Recharts
- Axios

## Project Structure

```
hazwal-inventory/
├── backend/
│   └── HazwalInventoryAPI/
│       ├── Controllers/          # API endpoints
│       ├── Models/               # Data models
│       ├── Services/             # Business logic
│       ├── Data/                 # Database context
│       ├── DTOs/                 # Data transfer objects
│       ├── Helpers/              # Utility helpers
│       └── Middleware/           # Custom middleware
│
└── frontend/
    └── hazwal-inventory-web/
        ├── src/
        │   ├── app/              # Routes and pages
        │   ├── components/       # React components
        │   ├── services/         # API services
        │   ├── stores/           # Redux store
        │   ├── styles/           # Tailwind styles
        │   └── utils/            # Utility functions
        ├── public/               # Static assets
        └── package.json          # Dependencies
```

## Prerequisites

- Node.js 18+ and npm
- .NET 9.0 SDK
- SQL Server or compatible database
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hazwal-inventory.git
cd hazwal-inventory
```

### 2. Backend Setup

```bash
cd backend/HazwalInventoryAPI

# Restore dependencies
dotnet restore

# Build the project
dotnet build

# Update database (if using migrations)
dotnet ef database update

# Run the application
dotnet run
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend/hazwal-inventory-web

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Environment Variables

### Frontend (.env.local)

Create `frontend/hazwal-inventory-web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Hazwal Inventory
```

### Backend (appsettings.Development.json)

Update `backend/HazwalInventoryAPI/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HazwalInventoryDB;User Id=sa;Password=YourPassword;"
  },
  "Jwt": {
    "SecretKey": "your-secret-key-min-32-chars-long",
    "ExpirationMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend/HazwalInventoryAPI
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd frontend/hazwal-inventory-web
npm run dev
```

### Production Build

**Frontend:**
```bash
npm run build
npm start
```

**Backend:**
```bash
dotnet publish -c Release
```

## Database

The application uses Entity Framework Core with SQL Server. Main tables:

- **Chemicals** - Chemical product data
- **Trucks** - Vehicle information
- **Deliveries** - Delivery records
- **Notifications** - System notifications
- **Users** - User and admin accounts

Run migrations with:
```bash
dotnet ef database update
```

## API Documentation

API endpoints are available at `/swagger` when running in development mode.

Main endpoints:
- `GET /api/chemicals` - Get all chemicals
- `POST /api/chemicals` - Create new chemical
- `GET /api/trucks` - Get all trucks
- `GET /api/deliveries` - Get all deliveries
- `POST /api/deliveries` - Create new delivery

## Contributing

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git commit -m "Add your feature description"
   ```

3. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, bug reports, or feature requests, please create an issue in this repository.

---

**Last Updated:** January 2026
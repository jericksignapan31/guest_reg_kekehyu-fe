# Kekehyu Hotel Guest Registration System - Backend API Documentation

## Overview

This is a comprehensive backend system for managing guest registrations at Kekehyu Hotel with the following features:

- **User Authentication**: Login/Register for front desk staff with JWT tokens
- **Guest Registration**: Complete guest registration with accompanying guests and policy acknowledgments
- **Admin Dashboard**: Dashboard with statistics (today, week, month) and transaction tracking
- **OCR ID Scanning**: Automatic ID scanning using Tesseract.js with intelligent data extraction
- **Transaction Logging**: Track all operations by front desk staff
- **PDF/Excel Reports**: Generate reports of all registrations and transactions

## Tech Stack

- **Runtime**: Node.js with NestJS framework
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **OCR**: Tesseract.js for ID scanning
- **File Upload**: Multer for handling file uploads

## Database Schema

### Users Table
- id (UUID)
- name (string)
- email (string, unique)
- password (hashed)
- role (FRONTDESK | ADMIN)
- createdAt, updatedAt

### Guests Table
- id (UUID)
- name (string)
- phone (string)
- email (string)
- country (string)
- idNumber (string, optional)
- idType (string, optional)
- createdAt, updatedAt

### Reservations Table
- id (UUID)
- reservationNumber (unique)
- checkInDate (date)
- checkOutDate (date)
- roomType (string)
- roomNumber (string)
- vehiclePlateNumber (optional)
- checkInTime (default: 14:00:00)
- checkOutTime (default: 11:00:00)
- userId (FK to Users)
- guestId (FK to Guests)
- createdAt, updatedAt

### Accompanying Guests Table
- id (UUID)
- name (string)
- validIdPresented (boolean)
- idType (string, optional)
- idNumber (string, optional)
- signature (base64, optional)
- reservationId (FK to Reservations)
- createdAt

### Policy Acknowledgments Table
- id (UUID)
- makeUpRoom (boolean)
- housekeepingStaff (boolean)
- smoking (boolean)
- corkage (boolean)
- noPets (boolean)
- damageDeductible (boolean)
- minorsCare (boolean)
- digitalSafe (boolean)
- dataPrivacy (boolean)
- guestSignature (base64, optional)
- reservationId (FK to Reservations)
- createdAt

### Transactions Table
- id (UUID)
- action (string)
- details (text, optional)
- userId (FK to Users)
- reservationId (FK to Reservations, optional)
- timestamp

## API Endpoints

### Authentication (`/auth`)

#### POST `/auth/register`
Register a new front desk user (Admin only)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "FRONTDESK" // Optional, defaults to FRONTDESK
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "FRONTDESK",
  "message": "User registered successfully"
}
```

#### POST `/auth/login`
Login with email and password

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "FRONTDESK"
  }
}
```

### Reservations/Guest Registration (`/reservations`)

#### POST `/reservations/register`
Register a new guest and create reservation

**Required Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "checkInDate": "2024-04-15",
  "checkOutDate": "2024-04-20",
  "roomType": "DELUXE DOUBLE",
  "roomNumber": "408",
  "vehiclePlateNumber": "ABC-123",
  "checkInTime": "14:00:00",
  "checkOutTime": "11:00:00",
  "guest": {
    "name": "Cherille Antonio",
    "phone": "0917826895",
    "email": "cherille@example.com",
    "country": "Philippines",
    "idNumber": "1234567",
    "idType": "Passport"
  },
  "accompanyingGuests": [
    {
      "name": "John Doe",
      "validIdPresented": true,
      "idType": "ID",
      "idNumber": "87654321",
      "signature": "base64_signature_string"
    }
  ],
  "policies": {
    "makeUpRoom": true,
    "housekeepingStaff": true,
    "smoking": false,
    "corkage": true,
    "noPets": true,
    "damageDeductible": false,
    "minorsCare": true,
    "digitalSafe": true,
    "dataPrivacy": true,
    "guestSignature": "base64_signature_string"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "reservationNumber": "RES-1713179000123-ABC12345",
  "guest": {
    "id": "uuid",
    "name": "Cherille Antonio",
    "phone": "0917826895",
    "email": "cherille@example.com",
    "country": "Philippines"
  },
  "message": "Reservation created successfully"
}
```

#### GET `/reservations/my-bookings`
Get all bookings made by the current user (front desk staff)

**Response:**
```json
[
  {
    "id": "uuid",
    "reservationNumber": "RES-1713179000123-ABC12345",
    "checkInDate": "2024-04-15",
    "checkOutDate": "2024-04-20",
    "roomType": "DELUXE DOUBLE",
    "roomNumber": "408",
    "guest": {...},
    "accompanyingGuests": [...],
    "policyAcknowledgments": [...],
    "createdAt": "2024-04-10T10:30:00Z"
  }
]
```

#### GET `/reservations/:id`
Get specific reservation details

#### GET `/reservations/stats/today`
Get today's reservation count and details

#### GET `/reservations/stats/week`
Get this week's reservation count and details

#### GET `/reservations/stats/month`
Get this month's reservation count and details

### Admin Dashboard (`/admin`)

#### GET `/admin/dashboard/stats`
Get dashboard statistics (today, week, month, total)

**Response:**
```json
{
  "today": 5,
  "week": 25,
  "month": 100,
  "total": 500,
  "timestamp": "2024-04-10T10:30:00Z"
}
```

#### GET `/admin/transactions`
Get all transactions with pagination

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "action": "GUEST_REGISTERED",
      "details": "Guest John Doe registered",
      "userId": "uuid",
      "reservationId": "uuid",
      "timestamp": "2024-04-10T10:30:00Z",
      "user": {...},
      "reservation": {...}
    }
  ],
  "pagination": {
    "total": 1000,
    "page": 1,
    "limit": 50,
    "pages": 20
  }
}
```

#### GET `/admin/transactions/user/:userId`
Get transactions by specific front desk user

#### GET `/admin/frontdesk/users`
Get all front desk users

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-04-01T10:30:00Z"
  }
]
```

#### GET `/admin/users/:userId/stats`
Get statistics for a specific front desk user

**Response:**
```json
{
  "userId": "uuid",
  "registrations": 50,
  "transactions": 150,
  "recentActivity": [...]
}
```

### OCR/ID Scanning (`/ocr`)

#### POST `/ocr/scan-id` (Form Data)
Scan ID image file using OCR

**Request:**
- Content-Type: multipart/form-data
- Form Field: `file` (image file - JPEG/PNG)

**Response:**
```json
{
  "success": true,
  "extractedText": "CHERILLE ANTONIO\nPassport: 1234567\nDOB: 01/15/1990\nPH",
  "parsedData": {
    "name": "CHERILLE ANTONIO",
    "idNumber": "1234567",
    "dateOfBirth": "01/15/1990",
    "nationality": "PH",
    "rawText": "..."
  },
  "confidence": 95.5
}
```

#### POST `/ocr/scan-id-base64`
Scan ID from base64 encoded image

**Request Body:**
```json
{
  "base64Data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "fileName": "id_card.jpg"
}
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation Steps

1. **Clone repository and install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create `.env` file in project root:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=kekehyu_guest_reg

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=1d

# Node Environment
NODE_ENV=development

# Server Port
PORT=3000
```

3. **Create PostgreSQL database:**
```bash
createdb kekehyu_guest_reg
```

4. **Run migrations (automatic with TypeORM synchronize):**
Database tables will be created automatically on first run.

5. **Start the application:**

**Development Mode:**
```bash
npm run start:dev
```

**Production Mode:**
```bash
npm run build
npm run start:prod
```

## Accessing the API

Once the server is running:

- **API Base URL**: `http://localhost:3000`
- **Swagger Documentation**: `http://localhost:3000/api/docs`
- **API Explorer**: Use Swagger UI to test endpoints directly

## Authentication Flow

1. **Register a frontdesk user** (Admin only):
   - POST `/auth/register` with name, email, password, and role

2. **Login**:
   - POST `/auth/login` with email and password
   - Receive JWT token in response

3. **Use the token**:
   - Add header: `Authorization: Bearer {token}`
   - Include in all protected endpoints

## Key Features

### Guest Registration
- Comprehensive guest information capture
- Support for accompanying guests
- Policy acknowledgments with digital signatures
- Automatic reservation number generation

### Admin Dashboard
- Real-time statistics (today, week, month)
- Total booking counts
- Transaction history tracking
- Per-user statistics

### ID Scanning
- Upload ID image for automatic data extraction
- Text recognition using Tesseract.js
- Smart parsing of ID information
- Support for multiple ID formats

### Data Validation
- Request validation using class-validator
- Automatic type transformation
- Email format validation
- Required field validation

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Server Error

Error Response Format:
```json
{
  "statusCode": 400,
  "message": "Example error message",
  "error": "Bad Request"
}
```

## CORS Configuration

CORS is enabled for all origins in development. Adjust in `main.ts` for production:

```typescript
app.enableCors({
  origin: ['https://yourdomain.com'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

## Testing

Run tests with:
```bash
npm test            # Unit tests
npm run test:e2e   # End-to-end tests
npm run test:cov   # Code coverage
```

## Deployment

For production deployment:

1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Use a process manager (PM2, systemd, etc.)
4. Setup reverse proxy (Nginx, Apache)
5. Configure SSL/TLS certificates
6. Use strong JWT secret
7. Enable database backups

## Support

For issues or questions, contact the development team.

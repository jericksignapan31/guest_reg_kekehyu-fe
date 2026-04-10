# Kekehyu Hotel Guest Registration System - Backend

A complete NestJS backend system for managing guest registrations at Kekehyu Hotel with admin dashboard, OCR ID scanning, and transaction tracking.

## Features

✅ **User Authentication** - JWT-based login/register for front desk staff  
✅ **Guest Registration** - Complete registration with accompanying guests and policies  
✅ **Admin Dashboard** - Statistics and analytics (today, week, month)  
✅ **OCR ID Scanning** - Automatic ID scanning using Tesseract.js  
✅ **Transaction Logging** - Track all operations by front desk staff  
✅ **Swagger API Docs** - Interactive API documentation  
✅ **PostgreSQL Database** - Robust data storage with TypeORM  

## Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **API Docs**: Swagger/OpenAPI
- **OCR**: Tesseract.js
- **File Upload**: Multer
- **Runtime**: Node.js 18+

## Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 12+ **OR** Supabase account (cloud database)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Database Setup Option A: Local PostgreSQL**
```bash
createdb kekehyu_guest_reg
```

3. **Database Setup Option B: Supabase (Recommended for production)**
- Follow [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for complete guide
- Sign up at [supabase.com](https://supabase.com)
- Get connection string and update `.env`

4. **Start development server:**
```bash
npm run start:dev
```

5. **Access the API:**
- API: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api/docs`

## API Endpoints

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user

### Guest Registration
- `POST /reservations/register` - Register new guest
- `GET /reservations/my-bookings` - Get user's bookings
- `GET /reservations/:id` - Get reservation details
- `GET /reservations/stats/today` - Today's stats
- `GET /reservations/stats/week` - Week's stats
- `GET /reservations/stats/month` - Month's stats

### Admin
- `GET /admin/dashboard/stats` - Dashboard statistics
- `GET /admin/transactions` - All transactions
- `GET /admin/transactions/user/:userId` - User transactions
- `GET /admin/frontdesk/users` - List front desk users
- `GET /admin/users/:userId/stats` - User statistics

### OCR
- `POST /ocr/scan-id` - Upload ID for scanning
- `POST /ocr/scan-id-base64` - Scan base64 image

## Database Schema

The system includes 6 main entities:
- **Users** - Front desk and admin staff
- **Guests** - Guest information
- **Reservations** - Booking records
- **AccompanyingGuests** - Additional guests
- **PolicyAcknowledgments** - Hotel policy acceptance
- **Transactions** - Activity logs

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed schema information.

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=kekehyu_guest_reg
JWT_SECRET=your_secret_key
JWT_EXPIRATION=1d
NODE_ENV=development
PORT=3000
```

## Build & Run

### Development
```bash
npm run start:dev      # with hot reload
npm run start:debug    # with debugging
```

### Production
```bash
npm run build          # Build project
npm run start:prod     # Run built version
```

## Testing

```bash
npm test              # Unit tests
npm run test:watch   # Watch mode
npm run test:cov     # Coverage report
npm run test:e2e     # End-to-end tests
```

## Project Structure

```
src/
├── entities/              # Database entities
├── modules/               # Feature modules
│   ├── auth/             # Authentication
│   ├── reservations/     # Guest registration
│   ├── admin/            # Admin features
│   └── ocr/              # OCR functionality
├── config/                # Configuration files
├── common/                # Shared utilities
├── app.module.ts         # Root module
└── main.ts               # Application entry point
```

## Documentation

For complete API documentation with examples, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

Interactive API documentation available at: `/api/docs`

## Key Features Explained

### Guest Registration
Complete registration form with:
- Guest personal information
- Accompanying guests support
- Hotel policy acknowledgments
- Digital signature capture
- Automatic reservation number generation

### Admin Dashboard
Real-time insights including:
- Today's bookings count
- This week's bookings count
- This month's bookings count
- Total system bookings
- Per-user statistics

### ID Scanning
Intelligent OCR processing:
- Upload ID image (JPEG/PNG)
- Automatic text extraction
- Smart data parsing
- Confidence scoring
- Base64 support for mobile apps

### Transaction Tracking
Complete audit trail:
- All front desk actions logged
- Timestamp tracking
- User attribution
- Reservation linking
- Pagination support

## Error Handling

All errors return appropriate HTTP status codes with detailed messages:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

## CORS Configuration

Currently enabled for all origins in development. Configure in `main.ts` for production.

## Deployment

1. Set production environment variables
2. Build the project: `npm run build`
3. Use a process manager (PM2, systemd)
4. Set up reverse proxy (Nginx)
5. Configure SSL/TLS
6. Enable database backups

## Performance Notes

- Database indexing on key fields
- Pagination support for large datasets
- JWT token caching
- Efficient query building with TypeORM

## Security

- Password hashing with bcryptjs
- JWT-based stateless authentication
- Input validation on all endpoints
- SQL injection protection via TypeORM
- CORS configuration
- Request validation pipes

## Contributing

1. Follow NestJS best practices
2. Add tests for new features
3. Update documentation
4. Use the provided ESLint configuration

## License

UNLICENSED

## Support

For questions or issues, contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** April 10, 2024

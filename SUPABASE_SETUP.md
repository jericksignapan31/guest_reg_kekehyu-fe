# Supabase Setup Guide

This guide explains how to connect the Kekehyu Hotel Guest Registration System to Supabase.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- PostgreSQL database
- Real-time subscriptions
- Built-in authentication (optional)
- REST API
- Row-level security

Perfect for our use case since our system already uses PostgreSQL!

## Step-by-Step Setup

### 1. Create Supabase Account & Project

1. **Go to** [supabase.com](https://supabase.com)
2. **Click "Start your project"** and sign up
3. **Create a new project:**
   - Project name: `kekehyu-hotel` (or any name)
   - Database password: Set a strong password
   - Region: Choose closest to your users (recommended: Asia/Singapore)
4. **Wait** for project to be created (usually 2-3 minutes)

### 2. Get Database Connection Details

After project is created:

1. **Go to Settings → Database** (left sidebar)
2. **Look for "Connection string"** section
3. **Copy the PostgreSQL connection details:**
   - Host: `[project].supabase.co`
   - Port: `5432`
   - User: `postgres`
   - Password: The password you set
   - Database: `postgres`

### 3. Update Environment Variables

Edit your `.env` file with Supabase details:

```env
# Database Configuration - SUPABASE
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_supabase_password
DB_NAME=postgres

# Keep other configs...
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=3000
```

**Example:**
```env
DB_HOST=myhotel-abc12345.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=SuperSecurePass123!
DB_NAME=postgres
```

### 4. Verify Connection

Test the connection before running the app:

**Windows (PowerShell):**
```powershell
# Install psql if needed or use online tools
# Or simply start the app and check for connection errors
npm run start:dev
```

**Mac/Linux:**
```bash
psql -h your-project.supabase.co -U postgres -d postgres -c "SELECT 1"
# Enter password when prompted
```

### 5. Start the Application

```bash
npm run start:dev
```

The TypeORM will automatically create all tables on first run!

### 6. Verify Tables in Supabase

1. **Go to Supabase Dashboard**
2. **Click "SQL Editor"** (left sidebar)
3. You should see tables:
   - `users`
   - `guests`
   - `reservations`
   - `accompanying_guests`
   - `policy_acknowledgments`
   - `transactions`

## Common Issues & Solutions

### Issue: "Connection refused"
**Solution:**
- Verify host is correct (no typos)
- Check if project region was selected
- Wait a few minutes for project to fully initialize

### Issue: "FATAL: remaining connection slots reserved"
**Solution:**
- Reduce connection pool size (development mode doesn't need many)
- The free tier has limited connections, use connection pooling

### Issue: "SSL certificate error"
**Solution:**
- Already configured in `typeorm.config.ts`
- Supabase requires SSL (`rejectUnauthorized: false`)

### Issue: Database name wrong
**Solution:**
- Supabase creates with name `postgres` by default
- Don't change DB_NAME unless you create a new database

## Production Deployment

For production:

1. **Update .env:**
```env
NODE_ENV=production
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=strong_production_password
DB_NAME=postgres
JWT_SECRET=very_long_random_secret_key
```

2. **Enable Backups:**
   - Go to Supabase Dashboard → Backups
   - Enable daily backups

3. **Set Row Level Security (RLS):**
   - Go to Authentication → Policies
   - Configure RLS for data security

4. **Monitor Usage:**
   - Check Supabase Dashboard for connection usage
   - Upgrade plan if needed

## Useful Supabase Features

### Access Database Directly

**Supabase Sidebar → SQL Editor:**
- Run custom queries
- View tables and data
- Create indexes

### Monitor Connections

**Supabase Sidebar → Database → Connections:**
- View active connections
- Identify performance issues

### Create Backups

**Supabase Sidebar → Backups:**
- Automatic daily backups (Pro plan)
- Manual backups anytime

### View API Documentation

**Supabase Sidebar → API Docs:**
- Auto-generated REST API
- JavaScript/TypeScript libraries

## Alternative: Supabase Connection Pooling

For production, use PgBouncer (connection pooling):

```env
# Use pooling mode for production
DB_HOST=your-project.supabase.co
DB_PORT=6543    # Use 6543 for pooling mode
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=postgres
```

**Note:** In pooling mode, use `postgres` as database name, not the project name.

## Pricing

**Supabase Pricing:**
- Free: 2GB storage, 2 concurrent connections
- Pro: $25/month, 250GB storage, 10 connections
- Custom: Contact sales

Perfect for small to medium projects!

## Support

If you encounter issues:

1. **Check Supabase Status:** https://status.supabase.com
2. **Review Logs:** Supabase Dashboard → Logs
3. **Contact Support:** In-app support chat
4. **Community:** Supabase Discord

## Next Steps

1. ✅ Setup Supabase project
2. ✅ Update .env with connection details
3. ✅ Run `npm run start:dev`
4. ✅ Test API endpoints at `http://localhost:3000/api/docs`
5. ✅ Deploy frontend (Angular) once backend is ready

---

You're all set! Your backend is now connected to Supabase. 🚀

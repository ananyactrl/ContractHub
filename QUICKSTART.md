# 🚀 ContractHub SaaS - Quick Start Guide

This guide will get you up and running in 5 minutes!

## 🎯 What You'll Have Running

- **Frontend**: React app with SaaS dashboard
- **Backend**: FastAPI server with JWT auth  
- **Database**: PostgreSQL with pgvector and sample data
- **Full Features**: Upload, Query, Dashboard, Insights

## ⚡ 5-Minute Setup

### Step 1: Database Setup (Choose One)

**Option A: Supabase (Recommended - Free)**
1. Go to [supabase.com](https://supabase.com) → Create project
2. In SQL Editor, run: `CREATE EXTENSION vector;`
3. Copy connection string from Settings → Database

**Option B: Local PostgreSQL**
```bash
createdb contracthub
psql contracthub -c "CREATE EXTENSION vector;"
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables (create .env file)
echo "DATABASE_URL=your-connection-string-here" > .env
echo "JWT_SECRET=super-secret-key-change-me" >> .env
echo "CORS_ORIGIN=http://localhost:5173" >> .env

# Initialize database with sample data
python init_db.py

# Start backend
uvicorn app.main:app --reload
```

Backend runs on http://localhost:8000

### Step 3: Frontend Setup

```bash
# Go back to root directory
cd ..

# Install dependencies  
npm install

# Start frontend
npm run dev
```

Frontend runs on http://localhost:5173

## 🎉 Demo Time!

### Login Credentials
- **Username**: `demo`
- **Password**: `password123`

### Try These Features

1. **Dashboard** → View sample contracts and analytics
2. **Upload** → Click "Upload Contract" → Drag any PDF
3. **Query** → Click "Query" → Ask: "What are the termination clauses?"
4. **Details** → Click "View Details" on any contract

## 🌐 Deploy to Production

### Frontend (Netlify)
1. Push to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Backend (Render)
1. Connect GitHub repo
2. Use existing `render.yaml`
3. Add DATABASE_URL and JWT_SECRET in environment

### Database
- Supabase: Already cloud-hosted
- Local: Migrate to Supabase or Railway

## ❓ Troubleshooting

**Database connection issues?**
- Check DATABASE_URL format: `postgresql://user:pass@host:port/db`
- Ensure pgvector extension is installed

**Frontend not loading?**
- Check if backend is running on port 8000
- Verify CORS_ORIGIN matches frontend URL

**Upload not working?**
- Login first (JWT token required)
- Check browser network tab for API errors

**Need help?**
- Check browser console for errors
- Verify all environment variables are set
- Ensure database has sample data (run `python init_db.py`)

## 🎊 You're All Set!

Your full-stack SaaS prototype is now running with:
- ✅ Multi-tenant authentication
- ✅ Document upload & parsing
- ✅ Vector search with pgvector
- ✅ Natural language queries
- ✅ Professional dashboard
- ✅ AI-powered insights

**Demo it, deploy it, or enhance it further!** 🚀

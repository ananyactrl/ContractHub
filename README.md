# ContractHub SaaS - Full-Stack Prototype

A complete full-stack SaaS prototype for contract management with AI-powered document parsing, vector search, and business intelligence dashboard.

## 🚀 Features

### Core Functionality
- **Multi-tenant Authentication**: JWT-based login with user isolation
- **Document Upload & Parsing**: Drag & drop interface with mock LlamaCloud parsing
- **Vector Search**: PostgreSQL + pgvector for semantic contract queries
- **Natural Language Queries**: RAG workflow for intelligent contract Q&A
- **Business Dashboard**: Professional SaaS-style interface with analytics
- **Contract Insights**: AI-powered risk analysis and recommendations

### Technical Implementation
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Python FastAPI with async support
- **Database**: PostgreSQL with pgvector extension
- **Authentication**: JWT tokens with secure multi-tenancy
- **Deployment Ready**: Configured for Netlify, Render, and cloud databases

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel (ready)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saasdashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Demo Credentials

- **Username**: Any username (e.g., `admin`, `user`, `demo`)
- **Password**: `test123`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main app layout with sidebar
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   └── UploadModal.tsx # File upload modal
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── LoginPage.tsx   # Login/authentication page
│   ├── DashboardPage.tsx # Main contracts dashboard
│   ├── ContractDetailPage.tsx # Individual contract view
│   ├── InsightsPage.tsx # Analytics and insights
│   ├── ReportsPage.tsx # Report generation
│   └── SettingsPage.tsx # User settings
├── services/           # API and data services
│   └── api.ts         # Mock API functions
└── App.tsx            # Main application component
```

## 🎨 Design Decisions

### UI/UX Choices
- **Modern Design**: Clean, professional interface with consistent spacing
- **Color Scheme**: Primary blue (#3b82f6) with semantic colors for status indicators
- **Typography**: Inter font family for excellent readability
- **Responsive**: Mobile-first approach with breakpoints at sm, md, lg, xl

### Technical Decisions
- **React Context**: Chosen over Redux for simpler state management needs
- **Tailwind CSS**: Utility-first CSS for rapid development and consistency
- **TypeScript**: Full type safety for better development experience
- **Mock API**: Simulated API calls with realistic delays and error handling

### Component Architecture
- **Functional Components**: Modern React with hooks only
- **Custom Hooks**: Reusable logic extraction where beneficial
- **Compound Components**: Layout component wrapping page content
- **Error Boundaries**: Graceful error handling throughout the app

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md-lg)
- **Desktop**: > 1024px (lg+)

Key responsive features:
- Collapsible sidebar on mobile
- Responsive table with horizontal scroll
- Adaptive grid layouts
- Touch-friendly interface elements

## 🎯 Key Features Implementation

### Authentication
- Mock JWT token storage in localStorage
- Protected routes with automatic redirect
- User session persistence across browser refreshes

### Contract Dashboard
- Real-time search across contract names and parties
- Multi-filter system (status, risk level)
- Pagination with configurable page size
- Loading and error states

### File Upload
- Drag & drop interface
- Progress tracking with visual indicators
- File type validation (PDF, DOC, DOCX)
- Simulated upload with success/error states

### Contract Details
- Comprehensive contract metadata display
- AI-generated clause analysis with confidence scores
- Risk insights with severity indicators
- Evidence panel with relevance scoring

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push

### Manual Build
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## 🧪 Testing

The application includes:
- Form validation and error handling
- Loading states for all async operations
- Empty states for no data scenarios
- Error boundaries for graceful failure handling

## 🔮 Future Enhancements

- Real API integration
- Advanced search and filtering
- Contract editing capabilities
- Bulk operations
- Export functionality
- Real-time notifications
- Dark mode support

## 📄 License

This project is created for demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
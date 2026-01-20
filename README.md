# Movie Tickets Front-End

A modern, full-featured cinema ticket booking platform built with Next.js 16, React 19, and TypeScript. This application provides a comprehensive solution for managing movie screenings, theater rooms, and ticket sales with separate interfaces for customers and administrators.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [Authentication & Authorization](#authentication--authorization)
- [User Interface Components](#user-interface-components)
- [Admin Features](#admin-features)
- [Customer Features](#customer-features)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Form Validation](#form-validation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

### Customer Features
- User registration and authentication
- Browse available movie shows with advanced filtering
- Filter shows by movie title, date, and theater room
- View detailed movie information including ratings, duration, and synopsis
- Select showtimes and purchase tickets
- Secure ticket booking with seat selection
- View booking confirmation and ticket details

### Admin Features
- Comprehensive dashboard for cinema management
- Movie catalog management (add, edit, delete movies)
- Upload and manage movie thumbnails
- Theater room configuration and management
- Show scheduling and management
- Real-time ticket sales monitoring
- User account management with role-based access
- Disable/enable user accounts

### Technical Features
- Server-side rendering with Next.js 16
- Client-side navigation with React Router
- Protected routes with role-based access control
- Responsive design for mobile and desktop
- Form validation with Zod and React Hook Form
- Optimized image loading with Next.js Image
- Modern UI with Tailwind CSS v4
- Type-safe development with TypeScript
- Code quality tools (ESLint, Prettier)

## Technology Stack

### Core Framework
- **Next.js 16.1.3** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety and developer experience

### State Management & Forms
- **React Hook Form 7.71.1** - Performant form handling
- **Zod 4.3.5** - Schema validation
- **@hookform/resolvers 5.2.2** - Form validation integration

### HTTP Client
- **Axios 1.13.2** - HTTP requests with interceptors

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React 0.562.0** - Modern icon library
- **clsx 2.1.1** - Conditional className utilities

### Date & Time
- **Moment.js 2.30.1** - Date manipulation and formatting

### Development Tools
- **ESLint 9** - Code linting
- **Prettier 3.8.0** - Code formatting
- **Prettier Plugin Tailwind 0.7.2** - Tailwind class sorting

## Project Structure

```
movie-tickets-front/
├── app/                          # Next.js app directory
│   ├── (features)/              # Feature-based routing
│   │   ├── (auth)/             # Authentication pages
│   │   │   ├── page.tsx        # Login page
│   │   │   ├── register/       # Registration page
│   │   │   └── layout.tsx      # Auth layout
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── movies/         # Movie management
│   │   │   ├── rooms/          # Room management
│   │   │   ├── shows/          # Show management
│   │   │   ├── tickets/        # Ticket management
│   │   │   └── users/          # User management
│   │   └── shows/              # Public show pages
│   │       ├── page.tsx        # Shows list
│   │       └── [id]/           # Show details
│   ├── _context/               # React Context providers
│   │   └── AuthContext.tsx    # Authentication context
│   ├── _hooks/                 # Custom React hooks
│   │   ├── useProtectedRoute.ts
│   │   └── useRouteGuard.ts
│   ├── _lib/                   # Utilities and configurations
│   │   └── axios.ts           # Axios instance setup
│   ├── _models/                # TypeScript interfaces
│   │   ├── entities/          # Domain entities
│   │   ├── requests/          # API request types
│   │   └── responses/         # API response types
│   ├── _services/              # API service layer
│   │   └── auth.service.ts    # Authentication services
│   ├── _ui/                    # UI components
│   │   └── components/        # Reusable components
│   │       ├── forms/         # Form components
│   │       ├── modal/         # Modal components
│   │       ├── partials/      # Layout partials
│   │       └── table/         # Table components
│   ├── _utils/                 # Utility functions
│   │   └── schemas/           # Validation schemas
│   └── globals.css            # Global styles
├── public/                     # Static assets
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm (recommended), npm, or yarn
- Backend API running (refer to backend repository)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amg1114/movie-tickets-front.git
cd movie-tickets-front
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. Create environment variables file:
```bash
cp .env.example .env.local
```

4. Configure environment variables (see [Environment Variables](#environment-variables))

5. Run the development server:
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_API_TIMEOUT=10000

# Application Configuration
NEXT_PUBLIC_APP_NAME=Movie Tickets
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### Environment Variable Descriptions

- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_API_TIMEOUT` - API request timeout in milliseconds
- `NEXT_PUBLIC_APP_NAME` - Application name displayed in UI
- `NEXT_PUBLIC_APP_URL` - Frontend application URL
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable/disable analytics tracking
- `NEXT_PUBLIC_ENABLE_DEBUG` - Enable/disable debug mode

## Available Scripts

### Development
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
```

### Code Quality
```bash
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
```

### Type Checking
```bash
pnpm type-check   # Run TypeScript compiler check
```

## Architecture

### App Router Structure

This project uses Next.js 16 App Router with the following conventions:

- **Route Groups**: `(features)`, `(auth)` - Organize routes without affecting URL structure
- **Dynamic Routes**: `[id]` - Dynamic segments for show details
- **Layouts**: Shared UI for route segments
- **Server Components**: Default for better performance
- **Client Components**: Used when interactivity is needed

### State Management

- **React Context API** - Global authentication state
- **Local State** - Component-level state with useState
- **Form State** - React Hook Form for complex forms

### Data Fetching

- **Client-side Fetching** - Axios with interceptors
- **Error Handling** - Centralized error handling with Axios interceptors
- **Loading States** - Custom loading spinner component

## Authentication & Authorization

### Authentication Flow

1. User submits login credentials
2. Credentials sent to backend API
3. API returns JWT token and user data
4. Token stored in localStorage
5. Token included in subsequent API requests via Axios interceptors
6. Protected routes validate authentication status

### Protected Routes

The application implements two types of route protection:

```typescript
// Customer protected route
<ProtectedRoute>
  {children}
</ProtectedRoute>

// Admin protected route
<ProtectedRoute requiredRole="admin">
  {children}
</ProtectedRoute>
```

### User Roles

- **Customer** - Can browse shows and purchase tickets
- **Admin** - Full access to management features

## User Interface Components

### Form Components

- **StyledInput** - Text input with validation
- **StyledSelect** - Dropdown select with options
- **StyledDatePicker** - Date selection component
- **StyledDateTimePicker** - Date and time selection
- **StyledFileInput** - File upload component
- **FormFeedback** - Success/error message display

### Table Components

- **StyledTable** - Responsive data table
- **TableHeader/Body/Row** - Table structure components
- **ActionButton** - Table action buttons
- **Badge** - Status badges

### Modal Components

- **Modal** - Reusable modal container
- **MovieFormModal** - Movie creation/editing
- **RoomFormModal** - Room creation/editing
- **ShowFormModal** - Show scheduling
- **ThumbnailUploadModal** - Image upload

### Layout Components

- **Header** - Navigation header with user menu
- **LoadingSpinner** - Loading indicator
- **ProtectedRoute** - Route authentication wrapper

## Admin Features

### Movie Management

- **Create Movies** - Add new movies to catalog
  - Title, genre, duration, rating
  - Release date, synopsis, director
  - Thumbnail upload support
- **Edit Movies** - Update movie information
- **Delete Movies** - Remove movies from catalog
- **Thumbnail Management** - Upload and update movie posters

### Room Management

- **Create Rooms** - Add theater rooms
  - Room name and number
  - Seating capacity configuration
- **Edit Rooms** - Update room details
- **Delete Rooms** - Remove unused rooms

### Show Management

- **Schedule Shows** - Create movie screenings
  - Select movie and room
  - Set start and end times
  - Configure ticket pricing
- **Edit Shows** - Modify show details
- **Delete Shows** - Cancel scheduled shows
- **View Details** - Link to public show page

### Ticket Management

- **View All Tickets** - Monitor ticket sales
- **Filter by Status** - Active, cancelled, expired
- **Cancel Tickets** - Admin ticket cancellation
- **View Customer Details** - User information per ticket

### User Management

- **View All Users** - List registered users
- **User Roles** - Display customer/admin status
- **Disable Accounts** - Temporarily disable users
- **Enable Accounts** - Reactivate disabled users

## Customer Features

### Show Browsing

- **Show List** - Grid display of available shows
- **Advanced Filtering**
  - Search by movie title
  - Filter by date
  - Filter by theater room
- **Clear Filters** - Reset all filters
- **Responsive Design** - Mobile-optimized layout

### Show Details

- **Movie Information**
  - Poster/thumbnail display
  - Title, rating, genre
  - Duration and release date
  - Director and synopsis
- **Show Information**
  - Screening date and time
  - Theater room details
  - Ticket price
  - Available seats

### Ticket Booking

- **Purchase Form**
  - Quantity selection
  - Total price calculation
  - Secure checkout
- **Booking Confirmation**
  - Success message
  - Ticket details display
  - Transaction summary

## API Integration

### Axios Configuration

The application uses a configured Axios instance with:

- Base URL from environment variables
- Request timeout configuration
- Authentication token interceptor
- Error response handling
- Request/response logging (development)

### API Endpoints

```typescript
// Authentication
POST   /auth/login
POST   /auth/register

// Movies
GET    /movies
GET    /movies/:id
POST   /movies
PATCH  /movies/:id
DELETE /movies/:id
POST   /movies/:id/thumbnail

// Rooms
GET    /rooms
GET    /rooms/:id
POST   /rooms
PATCH  /rooms/:id
DELETE /rooms/:id

// Shows
GET    /shows
GET    /shows/:id
POST   /shows
PATCH  /shows/:id
DELETE /shows/:id

// Tickets
GET    /tickets
GET    /tickets/:id
POST   /tickets
PATCH  /tickets/:id
DELETE /tickets/:id

// Users
GET    /users
GET    /users/:id
PATCH  /users/:id/disable
PATCH  /users/:id/enable
```

### Error Handling

- Network errors display user-friendly messages
- 401 errors redirect to login
- 403 errors show permission denied
- Validation errors display field-specific messages

## Styling

### Tailwind CSS v4

The project uses the latest Tailwind CSS with:

- Custom color palette
- Custom font families (Inter, Bungee)
- Responsive breakpoints
- Custom utility classes
- Dark theme optimized

### Typography

- **Primary Font**: Inter - Clean, modern sans-serif
- **Display Font**: Bungee - Bold headings and branding

### Color Scheme

- **Background**: Dark theme (#010102)
- **Primary**: Purple gradient (#7C3AED to #A855F7)
- **Text**: White with opacity variations
- **Accents**: Blue, red, green for status indicators

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Touch-optimized interactions

## Form Validation

### Zod Schemas

All forms use Zod for type-safe validation:

```typescript
// Login validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration validation
const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
```

### React Hook Form Integration

- Automatic validation on blur and submit
- Real-time error messages
- Type-safe form data
- Minimal re-renders for performance

## Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Vercel Deployment

This application is optimized for Vercel deployment:

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/amg1114/movie-tickets-front)

### Docker Deployment

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment-Specific Configuration

- **Development**: Hot reload, source maps, verbose logging
- **Production**: Optimized bundle, minification, compression

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting and formatting (`pnpm lint && pnpm format`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful commit messages
- Add comments for complex logic
- Ensure responsive design

### Commit Convention

Use conventional commits for clear history:

```
feat: Add movie filtering by genre
fix: Resolve ticket booking validation
docs: Update API integration guide
style: Format with Prettier
refactor: Simplify authentication logic
test: Add unit tests for forms
```

## License

This project is private and proprietary.

## Author

**Alejandro Moreno**

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment platform
- Tailwind CSS for the utility-first CSS framework
- React team for the UI library

---

For more information about Next.js features and API, visit the [Next.js Documentation](https://nextjs.org/docs).

For backend API documentation, refer to the [movie-tickets-api repository](https://github.com/amg1114/movie-tickets-api).


# Hotel Booking Website - Frontend

A modern, full-featured hotel booking website built with React, TypeScript, and Tailwind CSS. This frontend application provides a complete user interface for hotel room booking, user management, and administrative functions.

## 🚀 Features

### User Features
- **Room Browsing**: View available rooms with detailed information
- **Advanced Search & Filtering**: Filter rooms by price, capacity, amenities
- **Room Booking**: Complete booking flow with date selection
- **User Authentication**: Secure login/registration system
- **User Dashboard**: Manage bookings and profile
- **Responsive Design**: Optimized for all devices

### Admin Features
- **Dashboard**: Overview of bookings, revenue, and statistics
- **Room Management**: Add, edit, delete rooms with image uploads
- **Booking Management**: View and manage all bookings
- **Customer Management**: User administration and status management
- **System Settings**: Configure hotel information and system preferences

### Technical Features
- **Modern React**: Built with React 18 and TypeScript
- **State Management**: Zustand for efficient state management
- **Routing**: React Router for navigation
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI with custom styling
- **API Integration**: Complete service layer for backend communication
- **Error Handling**: Comprehensive error handling and loading states

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Figma
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_APP_NAME="Your Hotel Name"
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Radix UI)
│   ├── admin/          # Admin-specific components
│   └── user/           # User-specific components
├── pages/              # Page components
│   └── admin/          # Admin pages
├── layouts/            # Layout components
├── router/             # Routing configuration
├── store/              # Zustand stores
├── services/           # API services
├── utils/              # Utility functions
├── config/             # Configuration files
└── styles/             # Global styles
```

## 🔌 API Integration

The frontend is designed to work with a Node.js/Express backend. Key API endpoints:

- **Authentication**: `/api/auth/*`
- **Rooms**: `/api/rooms/*`
- **Bookings**: `/api/bookings/*`
- **Admin**: `/api/admin/*`

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Dark/Light Mode**: Theme switching support
- **Responsive Layout**: Mobile-first design
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation with helpful messages

## 🔐 Authentication

- JWT-based authentication
- Protected routes for authenticated users
- Role-based access control (User/Admin)
- Persistent login state
- Secure logout functionality

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Adapted layouts and navigation
- **Mobile**: Touch-friendly interface with mobile-specific optimizations

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | `Luxury Beach Resort` |
| `VITE_MAX_FILE_SIZE` | Max upload file size | `5242880` (5MB) |

### Customization

- **Branding**: Update colors in `tailwind.config.js`
- **Content**: Modify text content in components
- **Features**: Enable/disable features via environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

This frontend is designed to be:
- **Scalable**: Easy to add new features
- **Maintainable**: Clean code structure
- **Extensible**: Modular architecture
- **Future-proof**: Modern tech stack

---

**Note**: This frontend requires a compatible backend API to function fully. Make sure to set up the backend service and update the API configuration accordingly.
  
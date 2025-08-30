# 🎬 YouTube Clone - Enhanced React & Express Edition

A modern, full-featured YouTube clone built with React, Express, and the YouTube Data API. This enhanced version features a beautiful UI, fully responsive design optimized for all devices, dark/light themes, and comprehensive functionality that closely mimics the original YouTube experience.

## ✨ Features

### 🎨 Modern UI/UX
- **Beautiful, fully responsive design** that matches YouTube's current interface
- **Dark & Light theme support** with smooth transitions
- **Mobile-first responsive design** optimized for phones, tablets, and desktop
- **Touch-friendly interactions** with proper touch targets (44px minimum)
- **Smooth animations** and hover effects for better user experience
- **Component-based architecture** for maintainable code

### 🔍 Video Features
- **Browse trending videos** and popular content
- **Advanced search functionality** with filters and sorting
- **Video player** with full YouTube embed support
- **Video details** including views, likes, publish date
- **Related videos** suggestions
- **Channel information** with subscriber counts
- **Video descriptions** with show more/less functionality

### 🎛️ Interactive Elements
- **Category filters** for content discovery
- **Collapsible sidebar** with navigation options
- **Search with real-time suggestions**
- **Like/Dislike buttons** (UI only)
- **Subscribe buttons** (UI only)
- **Share functionality** with native Web Share API
- **Load more** pagination for infinite scrolling

### 🔧 Technical Features
- **React 18** with modern hooks and context
- **Express.js backend** with RESTful API
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Axios** for API calls with error handling
- **Material Icons** for consistent iconography
- **CSS Variables** for dynamic theming
- **Local Storage** for user preferences
- **Error boundaries** and loading states
- **Progressive Web App** features with touch optimization
- **Hardware acceleration** for smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- YouTube Data API v3 key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd youtube-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your YouTube API key:
   ```
   YOUTUBE_API_KEY=your_youtube_api_key_here
   NODE_ENV=development
   PORT=5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the React frontend (port 3000) and Express backend (port 5000) concurrently.

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
youtube-clone/
├── src/                    # React frontend source
│   ├── components/         # Reusable React components
│   │   ├── Header/        # Navigation header
│   │   ├── Sidebar/       # Navigation sidebar
│   │   └── VideoCard/     # Video display component
│   ├── pages/             # Page components
│   │   ├── Home/          # Homepage with trending videos
│   │   ├── VideoPlayer/   # Video watch page
│   │   └── SearchResults/ # Search results page
│   ├── context/           # React Context for state management
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── styles/            # Global styles and themes
├── server/                # Express backend
│   ├── routes/            # API route handlers
│   └── server.js          # Main server file
├── materials/             # Static assets (images, icons)
└── public/                # Public static files
```

## 🎯 API Endpoints

The backend provides a comprehensive REST API:

### Videos
- `GET /api/videos/popular` - Get trending/popular videos
- `GET /api/videos/:videoId` - Get specific video details
- `GET /api/videos/category/:categoryId` - Get videos by category
- `GET /api/videos/trending` - Get trending videos

### Search
- `GET /api/search?q={query}` - Search videos with filters

### Channels
- `GET /api/channels/:channelId` - Get channel details
- `GET /api/channels/:channelId/videos` - Get channel videos

### Comments
- `GET /api/videos/:videoId/comments` - Get video comments

### Utility
- `GET /api/health` - API health check
- `GET /api/videoCategories` - Get available video categories

## 🎨 Theming

The application supports dynamic theming with CSS variables:

### Dark Theme (Default)
- Background: `#0f0f0f`
- Secondary: `#212121`
- Text: `#ffffff`

### Light Theme
- Background: `#ffffff`
- Secondary: `#f9f9f9`
- Text: `#0f0f0f`

### Customization
You can easily customize themes by modifying the CSS variables in `src/index.css`.

## 📱 Responsive Design

The application features **mobile-first responsive design** with comprehensive breakpoints:

### 📱 Mobile Devices
- **Extra Small**: < 360px (Ultra-compact layout)
- **Small**: 360px - 479px (Compact mobile layout)
- **Medium**: 480px - 767px (Standard mobile layout)

### 📱 Tablet Devices
- **Small Tablet**: 768px - 1023px (Adaptive layout)
- **Large Tablet**: 1024px - 1199px (Enhanced layout)

### 💻 Desktop Devices
- **Standard**: 1200px - 1439px (Full features)
- **Large**: 1440px+ (Wide screen optimization)

### 🎯 Responsive Features
- **Adaptive grid layouts** that adjust to screen size
- **Touch-friendly interactions** with 44px minimum touch targets
- **Progressive content scaling** for optimal readability
- **Horizontal scroll prevention** on all screen sizes
- **Mobile-optimized navigation** with overlay sidebar
- **Responsive typography** that scales appropriately

## 🔧 Available Scripts

- `npm run dev` - Start development servers (frontend + backend)
- `npm run client` - Start only React development server
- `npm run server` - Start only Express server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌟 Key Components

### Header Component
- Logo and branding with responsive sizing
- Search functionality with mobile overlay
- Theme toggle with smooth transitions
- User actions (create, notifications, profile)
- Responsive mobile search with touch optimization
- Progressive search bar sizing (640px → 300px → 200px)

### Sidebar Component
- Navigation menu with responsive behavior
- Collapsible design (240px expanded, 72px collapsed)
- Mobile overlay sidebar with transform animations
- Category sections (Home, Library, Explore, Subscriptions)
- User preferences with localStorage persistence
- Footer links and copyright information
- Touch-optimized compact sidebar for mobile

### VideoCard Component
- Grid and list layout support with responsive breakpoints
- Thumbnail with duration overlay and loading skeletons
- Video metadata (title, channel, views, date)
- Hover effects and animations with hardware acceleration
- Loading skeletons with smooth animations
- Mobile-optimized card design with background styling
- Touch-friendly interactions with proper spacing

### Video Player Page
- YouTube iframe embed with responsive sizing
- Video information and actions with touch optimization
- Channel details with subscribe button and avatar
- Related videos sidebar with scrollable content
- Description with expand/collapse functionality
- Mobile-optimized layout with proper spacing

## 🎯 Features in Detail

### Search Functionality
- Real-time search with YouTube Data API
- Filter options (date, duration, type)
- Search result pagination
- Search query preservation in URL

### State Management
- React Context for global state with useReducer
- Local storage for user preferences (theme, sidebar state)
- Theme persistence across sessions with smooth transitions
- Sidebar state management with keyboard shortcuts (Escape, Ctrl+B)
- Responsive state handling for different screen sizes

### Error Handling
- API error boundaries with fallback UI
- Graceful failure with retry options
- Loading states and skeletons with smooth animations
- User-friendly error messages with actionable suggestions
- Network error handling with offline detection

## 🔑 YouTube API Integration

This project uses the YouTube Data API v3 for:
- Fetching popular and trending videos
- Video search with advanced filters
- Video details and statistics
- Channel information and subscriber counts
- Comment threads (optional)

### API Key Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Restrict the key to YouTube Data API v3
6. Add the key to your `.env` file

## 📱 Mobile-First Responsive Implementation

### 🎯 Responsive Design Strategy
The application implements a **mobile-first responsive design** approach that ensures optimal performance and user experience across all devices.

#### **CSS Architecture**
- **CSS Variables**: Dynamic theming with responsive values
- **Flexbox & Grid**: Modern layout systems for adaptive designs
- **Media Queries**: Progressive enhancement from mobile to desktop
- **Transform Animations**: Hardware-accelerated smooth transitions

#### **Touch Optimization**
- **44px Minimum Touch Targets**: Follows Apple/Google design guidelines
- **Touch Action CSS**: Optimized scrolling and gesture handling
- **Tap Highlight Removal**: Clean mobile experience
- **Momentum Scrolling**: iOS-style smooth scrolling

#### **Performance Features**
- **Hardware Acceleration**: GPU-accelerated animations
- **Efficient Transitions**: 0.2s ease-in-out for smooth UX
- **Reduced Repaints**: Optimized CSS for better performance
- **Progressive Loading**: Content loads progressively on mobile

### 📐 Layout System
- **Container Queries**: Responsive containers that adapt to content
- **Grid System**: Auto-fill grids that adjust to screen size
- **Flexible Typography**: Font sizes that scale appropriately
- **Adaptive Spacing**: Progressive padding and margin reduction

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```
YOUTUBE_API_KEY=your_production_api_key
NODE_ENV=production
PORT=5000
```

### Deployment Platforms
This application can be deployed to:
- **Vercel** (recommended for frontend)
- **Netlify** (frontend)
- **Heroku** (full-stack)
- **Railway** (full-stack)
- **DigitalOcean** (VPS)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **YouTube** for the original design inspiration and interface patterns
- **Google** for the YouTube Data API and Material Design guidelines
- **React team** for the amazing framework and hooks system
- **Material Design** for the icon system and design principles
- **Vite** for the excellent build tool and development experience
- **Apple & Google** for mobile design guidelines and touch optimization standards

## 📞 Support

If you have any questions or run into issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

---

## 📱 **Mobile Experience Guaranteed**

This YouTube Clone is **fully optimized for mobile devices** with:
- ✅ **No horizontal scrolling** on any screen size
- ✅ **Touch-friendly interactions** throughout the app
- ✅ **Responsive layouts** that adapt to all devices
- ✅ **Performance optimized** for mobile networks
- ✅ **Accessibility compliant** with proper touch targets

**Note**: This is an educational project for learning purposes. It is not affiliated with YouTube or Google. Please respect YouTube's Terms of Service and API usage guidelines.
# Pixly - AI-Powered Stock Photo Platform

A modern stock photo sharing platform built with .NET 8 and Angular, featuring advanced search capabilities, user authentication, and intelligent image management powered by Cloudinary.

## 🌟 Overview

Pixly is a comprehensive stock photo platform that allows users to discover, share, and manage high-quality images. The platform combines a robust .NET backend with a responsive Angular frontend to deliver a seamless experience for both photographers and content seekers.

## ✨ Key Features

### For Users
- **Advanced Search & Filtering** - Search photos by title, tags, orientation (landscape, portrait, square), and file size
- **Smart Suggestions** - Real-time search suggestions as you type
- **Responsive Gallery** - Masonry layout that adapts to any screen size with infinite scroll
- **User Interactions** - Like and save photos to your personal collections
- **Photo Management** - Upload, edit, and manage your photo portfolio

### For Developers
- **Clean Architecture** - Modular design with clear separation of concerns (API, Services, Models)
- **Generic CRUD Operations** - Reusable base controllers and services reduce code duplication
- **State Machine Pattern** - Robust photo lifecycle management (Draft → Pending → Approved/Rejected)
- **Consistent API Responses** - Standardized response format using `ApiResponse<T>` wrapper
- **Advanced Caching** - In-memory caching for improved performance
- **Real-time Email Queue** - RabbitMQ integration for asynchronous email processing

## 🏗️ Architecture

### Backend Structure
```
Pixly-BE/
├── Pixly.API/          # Web API layer with controllers and middleware
├── Pixly.Services/     # Business logic, services, and data access
└── Pixly.Models/       # Shared DTOs, requests, and response models
```

### Frontend Structure
```
Pixly-FE/
├── src/app/
│   ├── core/           # Services, guards, interceptors
│   ├── features/       # Feature modules (home, search, profile, register)
│   └── shared/         # Reusable components
```

## 🛠️ Technology Stack

### Backend
- **.NET 8** - Latest framework with C# 12 features
- **Entity Framework Core 8** - ORM with SQL Server
- **Cloudinary** - Cloud-based image management and optimization
- **RabbitMQ** - Message broker for email queuing
- **JWT Authentication** - Secure token-based authentication
- **Mapster** - High-performance object mapping

### Frontend
- **Angular 17** - Modern SPA framework
- **RxJS** - Reactive programming
- **Bootstrap 5** - Responsive UI framework
- **ngx-bootstrap** - Angular Bootstrap components
- **Font Awesome** - Icon library

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register              - Register new user
GET    /api/auth/confirm-email         - Confirm email address
POST   /api/auth/resend-confirmation   - Resend confirmation email
POST   /api/auth/login                 - User login
GET    /api/auth/current-user          - Get current user info
POST   /api/auth/setup-2fa             - Enable two-factor authentication
POST   /api/auth/logout                - Logout user
GET    /api/auth/generate-2fa-code     - Generate 2FA code
POST   /api/auth/two-factor            - Verify 2FA code
```

### Photos
```
GET    /api/photo                      - Get paginated photos
GET    /api/photo/{id}                 - Get photo by ID
GET    /api/photo/slug/{slug}          - Get photo by slug
POST   /api/photo                      - Upload new photo
PATCH  /api/photo/{id}                 - Update photo
GET    /api/photo/search-suggestion    - Get search suggestions
POST   /api/photo/{id}/like            - Like a photo
DELETE /api/photo/{id}/like            - Unlike a photo
POST   /api/photo/{id}/save            - Save to favorites
DELETE /api/photo/{id}/save            - Remove from favorites
POST   /api/photo/{id}/submit          - Submit for approval
POST   /api/photo/{id}/approve         - Approve photo (admin)
POST   /api/photo/{id}/reject          - Reject photo (admin)
POST   /api/photo/{id}/hide            - Hide photo
POST   /api/photo/{id}/delete          - Delete photo
GET    /api/photo/{id}/allowed-actions - Get allowed actions for photo
```

### Tags
```
GET    /api/tag                        - Get all tags
GET    /api/tag/{id}                   - Get tag by ID
POST   /api/tag                        - Create new tag
PATCH  /api/tag/{id}                   - Update tag
```

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- SQL Server (local or remote)
- Docker (optional, for RabbitMQ)
- Cloudinary account

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pixly.git
cd pixly/Pixly-BE
```

2. Create a `.env` file in the root directory:
```env
# Database
DB_CONNECTION_STRING=Server=localhost;Database=PixlyDb;Trusted_Connection=true;TrustServerCertificate=true;

# JWT Settings
JWT_SECRET=your-very-long-secret-key-at-least-32-characters
JWT_ISSUER=Pixly
JWT_AUDIENCE=PixlyUsers

# Cloudinary
CLOUDINARY_CLOUDNAME=your-cloudinary-cloud-name
CLOUDINARY_APIKEY=your-cloudinary-api-key
CLOUDINARY_APISECRET=your-cloudinary-api-secret

# SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_ENABLE_SSL=true
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Pixly

# RabbitMQ (optional)
RABBITMQ_HOST=localhost
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_PORT=5672
```

3. Run database migrations:
```bash
cd Pixly.Services
dotnet ef database update
```

4. Start the backend:
```bash
cd ../Pixly.API
dotnet run
```

The API will be available at `https://localhost:7136`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../Pixly-FE
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

The application will be available at `http://localhost:4200`

### Running with Docker (Optional)

For RabbitMQ support:
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

## 🔐 Authentication Implementation

The platform uses a comprehensive JWT-based authentication system with the following features:

### Security Features
- **JWT Tokens** - Short-lived access tokens (15 minutes) with refresh token rotation
- **Email Confirmation** - Required for full account access
- **Two-Factor Authentication** - Optional 2FA via email codes
- **Rate Limiting** - Protection against brute force attacks
- **Refresh Token Security** - 
  - Automatic rotation on use
  - Detection of token reuse
  - Maximum 5 active sessions per user
  - 7-day expiration

### Authentication Flow
1. User registers → Email confirmation sent
2. User confirms email → Account activated
3. User logs in → JWT + Refresh token issued
4. Token expires → Automatic refresh via interceptor
5. Optional 2FA → Email code verification

### Security Middleware
- Global error handling
- CORS configuration
- Rate limiting policies (auth, IP-based, email-based)
- JWT validation and automatic token refresh

## 📸 Photo Lifecycle

Photos follow a state machine pattern ensuring consistent workflow:

```
Initial → Draft → Pending → Approved → Published
                     ↓         ↓
                  Rejected   Hidden
                              ↓
                           Deleted
```

Each state has specific allowed actions, ensuring data integrity and proper workflow management.

## 🎯 Future Plans

### Phase 1 - Enhanced User Experience
- **User Profiles** - Public photographer portfolios
- **Collections** - Organize saved photos into collections
- **Advanced Analytics** - View counts, download statistics, trending photos
- **Social Features** - Follow photographers, activity feed

### Phase 2 - Content & Commerce
- **Comments System** - Engage with the community
- **Photo Licensing** - Different license types for photos
- **Payment Integration** - Buy and sell premium photos
- **Watermarking** - Automatic watermarks for non-licensed downloads

### Phase 3 - AI & Advanced Features
- **AI Tagging** - Automatic tag suggestions using machine learning
- **Similar Photo Search** - Find visually similar images
- **Real-time Notifications** - SignalR integration for instant updates
- **Mobile Apps** - Native iOS and Android applications

### Technical Improvements
- **Redis Caching** - Replace in-memory cache with Redis
- **Elasticsearch** - Advanced search capabilities
- **CDN Integration** - Global content delivery
- **Kubernetes** - Container orchestration for scaling
- **GraphQL API** - Alternative API for flexible queries

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using .NET and Angular
- Images optimized by Cloudinary
- Icons by Font Awesome
- UI components from ngx-bootstrap

---

**Note**: This is an active project under development. Features and documentation are continuously being improved.
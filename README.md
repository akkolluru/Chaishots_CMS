# Chaishots CMS

A comprehensive content management system for educational content with hierarchical structure: Programs → Terms → Lessons. Features scheduled publishing, multi-language support, and role-based access control.

## Features

- **Hierarchical Content Management**: Programs → Terms → Lessons structure
- **Multi-language Support**: Content in multiple languages with assets per language
- **Scheduled Publishing**: Automatic publishing of scheduled lessons
- **Role-based Access Control**: Admin, Editor, Viewer permissions
- **Media Asset Management**: Support for multiple asset variants per language
- **Public Catalog API**: Consumer-facing API with caching headers
- **Background Processing**: Reliable scheduled publishing worker
- **Docker Deployment**: Complete containerized setup

## Tech Stack

- **Backend**: NestJS, TypeScript, PostgreSQL, Prisma ORM
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Authentication**: JWT with role-based permissions
- **Background Jobs**: Cron-based publishing worker
- **Caching**: Redis for sessions and job queues
- **Containerization**: Docker Compose

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   Background    │
│   (Next.js)     │◄──►│    (NestJS)      │◄──►│    Worker       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   PostgreSQL     │
                       │   Database       │
                       └──────────────────┘
                              │
                              ▼
                          ┌─────────────┐
                          │    Redis    │
                          │   Cache/Job │
                          │   Queue     │
                          └─────────────┘
```

## Database Schema

### Core Entities
- **Program**: Educational program with multi-language support
- **Term**: Course term within a program
- **Lesson**: Individual lesson with content and publishing workflow
- **Topic**: Category system for organizing programs
- **User**: Authentication with role-based permissions
- **Asset**: Media assets per language and variant

### Relationships
- Programs ↔ Topics (many-to-many)
- Programs → Terms (one-to-many)
- Terms → Lessons (one-to-many)
- Lessons ↔ Assets (one-to-many)

### Constraints & Indexes
- Primary language must be included in available languages
- Unique constraints on lesson numbers per term
- Unique constraints on term numbers per program
- Indexes on status, publishAt, and publishedAt fields
- Foreign key relationships with cascade deletes

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - User logout

### Programs Management
- `GET /programs` - Get all programs (requires auth)
- `GET /programs/:id` - Get specific program
- `POST /programs` - Create program
- `PUT /programs/:id` - Update program
- `DELETE /programs/:id` - Delete program
- `POST /programs/:id/publish` - Publish program
- `POST /programs/:id/archive` - Archive program

### Lessons Management
- `GET /lessons` - Get all lessons (requires auth)
- `GET /lessons/:id` - Get specific lesson
- `POST /lessons` - Create lesson
- `PUT /lessons/:id` - Update lesson
- `DELETE /lessons/:id` - Delete lesson
- `POST /lessons/:id/publish-now` - Publish lesson immediately
- `POST /lessons/:id/schedule` - Schedule lesson for publishing
- `POST /lessons/:id/archive` - Archive lesson

### Public Catalog API
- `GET /catalog/programs` - Get published programs
- `GET /catalog/programs/:id` - Get specific published program
- `GET /catalog/lessons/:id` - Get specific published lesson

### Health Check
- `GET /health` - Health status endpoint

## Frontend Routes

- `/` - Dashboard with overview
- `/login` - Authentication page
- `/programs` - Programs management
- `/lessons` - Lessons management
- `/terms` - Terms management
- `/topics` - Topics management

## Authentication & Authorization

### Roles
- **Admin**: Full access to all features
- **Editor**: Can create, update, publish content
- **Viewer**: Read-only access to content

### Implementation
- JWT-based authentication with refresh tokens
- Role-based guards protecting endpoints
- Session management with Redis
- Password hashing with Argon2

## Scheduled Publishing System

### Worker Service
- Runs every minute to check for scheduled lessons
- Processes lessons with `status=scheduled` and `publishAt <= now()`
- Updates lesson status to `published` with timestamp
- Automatically updates parent program status when lessons are published
- Idempotent operations to prevent duplicate processing
- Concurrency-safe with database transactions

### Publishing Workflow
1. Lesson created with `status=draft`
2. Lesson scheduled with `status=scheduled` and `publishAt`
3. Worker checks every minute for ready-to-publish lessons
4. Lesson published with `status=published` and `publishedAt`
5. Parent program automatically published if not already published

## Multi-language Support

### Content Languages
- Primary language must be included in available languages
- Content URLs per language
- Subtitle languages and URLs per language
- Validation to ensure consistency

### Asset Variants
- **Portrait/Landscape/Square/Banner** variants
- **Poster/Thumbnail/Subtitle** asset types
- Assets per language and variant
- Proper validation for required assets

## Caching Strategy

### Public Catalog API
- Cache headers: `Cache-Control: public, s-maxage=300, stale-while-revalidate=600`
- 5-minute cache with 10-minute stale period
- Proper Vary headers for content negotiation

### Health Checks
- No-cache headers to prevent caching
- Fresh status on every request

## Error Handling

### Consistent Format
All errors return in the format:
```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "details": { ... }
}
```

### Validation
- Comprehensive input validation using class-validator
- Database constraint validation
- Business logic validation
- Proper error messages for all failure scenarios

## Deployment

### Production Deployment Options

The application is designed for containerized deployment with the following options:

#### **Option 1: Self-hosted with Docker Compose**
```bash
# Clone the repository
git clone <repository-url>
cd chaishots

# Set environment variables
cp api/.env.example api/.env
cp web/.env.example web/.env

# Build and start all services
docker-compose up --build -d

# Monitor services
docker-compose logs -f
```

#### **Option 2: Cloud Platforms (Recommended)**
The application can be deployed to:
- **AWS ECS/Fargate** - Containerized deployment with managed scaling
- **Google Cloud Run** - Serverless container deployment
- **Azure Container Apps** - Managed container service
- **Railway** - Modern platform with easy deployment
- **Render** - Simple container deployment

#### **Environment Configuration for Production**
```bash
# API Environment Variables
DATABASE_URL=postgresql://username:password@host:port/database
REDIS_URL=redis://host:port
JWT_SECRET=your-production-jwt-secret
REFRESH_JWT_SECRET=your-production-refresh-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
NODE_ENV=production

# Web Environment Variables
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

#### **Docker Compose Services**
- **api**: Main API server (port 3000)
- **web**: Frontend application (port 3001)
- **db**: PostgreSQL database (port 5432)
- **redis**: Redis cache (port 6379)
- **migrate**: Database migrations
- **worker**: Background publishing worker

#### **Production Requirements**
- **Database**: PostgreSQL 15+ with sufficient storage
- **Cache**: Redis 7+ for sessions and job queues
- **Storage**: External storage for media assets (S3, GCS, etc.)
- **SSL/TLS**: HTTPS termination at load balancer
- **Monitoring**: Health checks at `/health` endpoint
- **Backup**: Regular database backups
- **Logging**: Centralized log aggregation
- **Security**: WAF, rate limiting, and DDoS protection

#### **Scaling Recommendations**
- **API**: Horizontal scaling based on request volume
- **Worker**: Scale based on publishing workload
- **Database**: Vertical scaling initially, consider read replicas for high traffic
- **Redis**: Consider clustering for high availability
- **Frontend**: CDN for static assets, horizontal scaling

#### **Health Checks**
- API Health: `GET /health` - Returns 200 OK when healthy
- Database connectivity checked in health endpoint
- Proper readiness/liveness probes for container orchestration

#### **Deployment Verification**
After deployment, verify:
1. API responds at `/health` endpoint
2. Frontend loads at root URL
3. Database migrations completed successfully
4. Worker is processing scheduled lessons
5. All environment variables are properly set
6. CORS headers are configured for production domains
7. SSL certificates are properly configured

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: JWT signing key
- `PORT`: Application port

## Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Running Locally
```bash
# Clone the repository
git clone <repository-url>
cd chaishots

# Start all services
docker-compose up --build

# Access the applications
# Admin CMS: http://localhost:3001
# API: http://localhost:3000
# Health: http://localhost:3000/health
```

### Seeded Data
The system includes sample data:
- Users: admin@chaishots.com (password: password123)
- Programs: Advanced Mathematics, Basic Science
- Terms: Algebra Basics, Calculus Fundamentals
- Lessons: Introduction to Algebra, Linear Equations, etc.

## Production Considerations

### Security
- JWT tokens with proper expiration
- Rate limiting on authentication endpoints
- Helmet.js security headers
- Input validation and sanitization

### Performance
- Database indexing on frequently queried fields
- Redis for session management and caching
- Proper pagination on list endpoints
- Efficient database queries with proper joins

### Monitoring
- Structured logging with correlation IDs
- Health check endpoint for container orchestration
- Error tracking and reporting

## Testing

### API Testing
- Unit tests for services
- Integration tests for controllers
- End-to-end tests for critical workflows

### Frontend Testing
- Component tests for UI elements
- Integration tests for API interactions
- End-to-end tests for user flows

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT
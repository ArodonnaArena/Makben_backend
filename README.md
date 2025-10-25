# Makben Portfolio Backend API

Complete REST API for the dynamic portfolio management system.

## Features

- 🔐 JWT Authentication
- 📁 File Upload (Images, Documents)
- 🗄️ MongoDB Database
- 🛡️ Security (Helmet, CORS)
- 📝 TypeScript
- 🎨 Complete CRUD for all resources

## Prerequisites

- Node.js 18+
- MongoDB (installed locally or connection string)

## Installation

```bash
# Install dependencies
npm install

# Configure environment variables
# Create .env file (see .env for example)

# Start MongoDB service (if local)
# MongoDB should be running on mongodb://localhost:27017
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/makben-portfolio
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

## Scripts

```bash
# Development (with auto-reload)
npm run dev

# Development with watch mode
npm run dev:watch

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Profile
- `GET /api/profile` - Get profile (public)
- `PUT /api/profile` - Update profile (admin only)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get single skill
- `POST /api/skills` - Create skill (admin only)
- `POST /api/skills/bulk` - Bulk create skills (admin only)
- `PUT /api/skills/:id` - Update skill (admin only)
- `DELETE /api/skills/:id` - Delete skill (admin only)

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get single experience
- `POST /api/experiences` - Create experience (admin only)
- `PUT /api/experiences/:id` - Update experience (admin only)
- `DELETE /api/experiences/:id` - Delete experience (admin only)

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/:id` - Get single achievement
- `POST /api/achievements` - Create achievement (admin only)
- `PUT /api/achievements/:id` - Update achievement (admin only)
- `DELETE /api/achievements/:id` - Delete achievement (admin only)

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Admin routes require a user with `role: 'admin'`.

## File Uploads

Endpoints that accept file uploads:
- Profile: `profileImage`, `resume`
- Projects: `imageUrl`, `images` (multiple)
- Experiences: `companyLogo`
- Achievements: `achievement` (image), `document`

Files are stored in `/uploads` directory with organized subdirectories.

## Database Models

### User
- email, password, name, role, createdAt, lastLogin

### Profile
- Personal info, contact details, social links, stats, skills, languages

### Project
- title, description, technologies, images, status, category, dates, etc.

### Skill
- name, category, proficiency, icon

### Experience
- company, position, dates, description, responsibilities, achievements

### Achievement
- title, description, date, category, issuer, images, documents

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Helmet security headers
- CORS configuration
- File upload validation
- Input sanitization

## Development

```bash
# Run in development mode
npm run dev

# MongoDB must be running
# Default: mongodb://localhost:27017/makben-portfolio
```

## Testing API

Use tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)
- curl

## First Time Setup

1. Start MongoDB
2. Run backend: `npm run dev`
3. Register first admin user via POST `/api/auth/register` with:
```json
{
  "email": "admin@example.com",
  "password": "securepassword",
  "name": "Admin Name",
  "role": "admin"
}
```

## Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify MongoDB service status

**Port already in use:**
- Change PORT in .env
- Or stop the process using port 5000

**File upload errors:**
- Check uploads directory permissions
- Verify file size limits (10MB default)
- Check file type restrictions

# 🚀 ProtoSpirit: AI-Powered Application Builder

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

ProtoSpirit transforms natural language descriptions into complete, functional web applications with sophisticated role-based access control. Simply describe your application requirements in plain English, and watch as ProtoSpirit generates a fully working prototype with database schema, user interfaces, and permission systems.

## ✨ Features

### 🤖 AI-Powered Generation
- **Natural Language Processing**: Describe your app in plain English
- **Intelligent Extraction**: Automatically identifies entities, relationships, and roles
- **Smart Validation**: AI validates and optimizes your requirements
- **Powered by Google Gemini**: Cutting-edge AI for accurate requirement parsing

### 🎨 Dynamic UI Generation
- **Real-time Previews**: See your application come to life instantly
- **Role-based Interfaces**: Different views for different user types
- **Responsive Design**: Works perfectly on desktop and mobile
- **Interactive Prototypes**: Fully functional demo applications

### 🔐 Advanced Role Management
- **Granular Permissions**: Control access at feature and entity levels
- **Role Simulation**: Switch between roles to test different user experiences
- **Custom Access Control**: Define read/write permissions for each role
- **Secure by Default**: Built-in authentication and authorization

### 📊 Professional Project Management
- **Full CRUD Operations**: Create, read, update, and delete projects
- **Advanced Search**: Filter and find projects quickly
- **Export Capabilities**: Generate React components, JSON schemas, and documentation
- **Version Control**: Track changes and project evolution

### 🎯 Entity Relationship Modeling
- **Visual Diagrams**: Interactive entity relationship diagrams
- **Relationship Management**: Define complex relationships between entities
- **Data Validation**: Ensure data integrity with built-in validation rules
- **Sample Data Generation**: Automatic generation of realistic test data

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── CreateApp/     # Application creation workflow
│   │   ├── ProjectDetails/ # Project management and editing
│   │   ├── Projects/      # Project listing and search
│   │   └── common/        # Shared components
│   ├── pages/             # Main application pages
│   ├── services/          # API communication
│   ├── utils/             # Helper functions
│   └── types/             # TypeScript definitions
```

### Backend (Node.js + Express)
```
backend/
├── src/
│   ├── models/            # MongoDB schemas and models
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── middleware/        # Authentication and validation
│   ├── utils/             # Helper functions
│   └── types/             # TypeScript definitions
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/protospirit.git
cd protospirit
```

2. **Set up environment variables**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required: GEMINI_API_KEY, MONGODB_URI, JWT_SECRET
```

3. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

4. **Start MongoDB**
```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Start the application**

**Development Mode:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Production Mode:**
```bash
# Build and start backend
cd backend
npm run build
npm start

# Build and serve frontend
cd frontend
npm run build
npm run preview
```

6. **Access the application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### Default Demo Accounts

| Username | Password | Role  | Description |
|----------|----------|-------|-------------|
| admin    | admin123 | Admin | Full system access |
| demo     | demo123  | User  | Standard user access |

## 🎮 Usage

### 1. Create Your First Application

1. **Navigate to "Create New App"**
2. **Describe your application** in natural language:
   ```
   I need a restaurant management system with menu items,
   staff scheduling, and customer orders. Managers should
   have full access, while staff can only view schedules
   and take orders.
   ```
3. **Review generated requirements** and make adjustments
4. **Save your project** and explore the generated application

### 2. Explore Your Generated App

- **Switch between roles** to see different user experiences
- **Test CRUD operations** on your entities
- **View relationship diagrams** to understand data connections
- **Export components** for use in your own projects

### 3. Manage Projects

- **Search and filter** your projects
- **Edit entities and relationships** as your requirements evolve
- **Add or modify user roles** and permissions
- **Export project data** in various formats

## 🛠️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Backend server port | `3000` | No |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/protospirit` | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | - | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` | No |

### AI Configuration

ProtoSpirit uses Google's Gemini AI for natural language processing. To configure:

1. **Get API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Set Environment Variable**: `GEMINI_API_KEY=your_api_key_here`
3. **Adjust Prompts**: Modify `backend/src/services/gemini.ts` for custom behavior

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🌟 Acknowledgments

- **Google Gemini AI** for powerful natural language processing
- **React Flow** for beautiful entity relationship diagrams
- **Tailwind CSS** for rapid UI development
- **MongoDB** for flexible data storage
- **TypeScript** for type safety and developer experience

## 📈 Roadmap

### Short-term Goals
- [ ] Add support for more AI providers (OpenAI, Claude)
- [ ] Implement real-time collaboration
- [ ] Add more export formats (SQL, Prisma schemas)
- [ ] Enhanced error handling and validation

### Long-term Vision
- [ ] Visual entity designer with drag-and-drop
- [ ] Plugin system for custom components
- [ ] Multi-language support
- [ ] Integration with popular frameworks (Next.js, Laravel)
- [ ] Cloud deployment with one-click hosting

---

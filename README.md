# AI Knowledgebase Generator

An intelligent codebase documentation generator that uses AI to automatically create comprehensive documentation, architecture summaries, API documentation, and onboarding guides from GitHub repositories.

## Features

- 🔍 **Repository Indexing**: Clone and index GitHub repositories automatically
- 📚 **AI-Powered Documentation Generation**:
  - Onboarding guides for new developers
  - Architecture summaries with system overview
  - Comprehensive API documentation
  - Architecture diagrams
- 🔐 **User Authentication**: Secure signup and login system
- 🗄️ **Vector Database**: Uses Supabase with LangChain for semantic search and retrieval
- 🎨 **Modern UI**: React frontend with TypeScript

## Tech Stack

### Backend
- **Node.js** with **Express** (TypeScript)
- **LangChain** for AI/LLM integration
- **OpenAI API** for generating documentation
- **Supabase** for vector database and user authentication
- **JWT** for authentication tokens
- **bcrypt** for password hashing

### Frontend
- **React 19** with **TypeScript**
- **Vite** for build tooling
- **React Router** for navigation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- OpenAI API key
- Supabase account with a project set up

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PrudhviPuli/AI-Knowledgebase-Generator.git
   cd AI-Knowledgebase-Generator
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install --legacy-peer-deps
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   # OpenAI API Keys
   OPEN_API_KEY=your-openai-api-key-here
   OPENAI_API_KEY=your-openai-api-key-here

   # Supabase Configuration
   SUPABASE_URL_LC_CHATBOT=https://your-project-id.supabase.co
   SUPABASE_API_KEY=your-supabase-anon-key-here

   # JWT Secret for authentication
   SECRET=your-jwt-secret-key-here
   ```

   **Note**: You can use the same OpenAI API key for both `OPEN_API_KEY` and `OPENAI_API_KEY`.

5. **Set up Supabase**

   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Create a table named `documents` with the following schema:
     - `repo_id` (text)
     - `file_path` (text)
     - `chunk_index` (integer)
     - `chunk_id` (text, primary key)
     - `content` (text)
     - `metadata` (jsonb)
     - `embedding` (vector) - using pgvector extension
   - Create a table named `users` for authentication:
     - `id` (uuid, primary key)
     - `email` (text, unique)
     - `password` (text)
     - `name` (text)

## Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:8000`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Sign Up / Login**
   - Create an account or log in with existing credentials

2. **Upload a Repository**
   - Enter a GitHub repository clone URL (e.g., `https://github.com/user/repo.git`)
   - Click "Generate!" to start the indexing process
   - The system will:
     - Clone the repository
     - Process and split code files
     - Generate embeddings
     - Store in Supabase vector database

3. **Generate Documentation**
   - The system can generate:
     - **Onboarding Guide**: Introduction, explanation, and environment setup instructions
     - **Architecture Summary**: System overview, components, data flow, tech stack, design patterns
     - **API Documentation**: Complete API reference with endpoints, requests, and responses
     - **Architecture Diagram**: Visual representation of the system architecture

## Project Structure

```
AI-Knowledgebase-Generator/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   │   ├── apiDocsController.ts
│   │   │   ├── architectureSummaryController.ts
│   │   │   ├── diagramController.ts
│   │   │   ├── githubController.ts
│   │   │   ├── onboardingController.ts
│   │   │   └── ...
│   │   ├── database/          # Database clients and retrievers
│   │   ├── middleware/        # Authentication middleware
│   │   ├── routes/            # Express routes
│   │   ├── types/             # TypeScript type definitions
│   │   └── server.ts          # Main server file
│   ├── .env                   # Environment variables (create this)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── endpoints/       # API endpoint functions
│   │   ├── utils/            # Utility functions
│   │   └── css/              # Stylesheets
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /signup` - Create a new user account
- `POST /login` - Login and receive JWT token
- `GET /me` - Get current user (requires authentication)

### Repository
- `GET /download-repo?repolink=<url>` - Clone and index a GitHub repository

### LLM Routes
- `GET /` - LLM-related endpoints (configured in `llmRoutes.ts`)

## Configuration

### Excluded Files
The system automatically excludes:
- `node_modules/`
- `.git/`
- `dist/`, `build/`, `.next/`, `.turbo/`
- `package-lock.json` files

### Supported File Types
- TypeScript/JavaScript: `.ts`, `.tsx`, `.js`, `.jsx`
- Python: `.py`
- Java: `.java`
- Go: `.go`
- Rust: `.rs`
- Markdown: `.md`
- Text: `.txt`
- JSON: `.json` (except `package-lock.json`)
- YAML: `.yml`, `.yaml`
- SQL: `.sql`
- LICENSE files

## Development

### Backend Development
```bash
cd backend
npm start  # Compiles TypeScript and runs the server
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server with hot reload
```

### Testing Controllers
You can test individual controllers by uncommenting them in `backend/src/server.ts`:
```typescript
// Uncomment to test:
// onboardingController();
// architectureSummaryController();
// apiDocsController();
// diagramController();
```

## Troubleshooting

### Peer Dependency Issues
If you encounter peer dependency conflicts during installation, the project includes an `.npmrc` file with `legacy-peer-deps=true` to handle this automatically.

### Environment Variables
Make sure all required environment variables are set in `backend/.env`. The application will fail to start if any are missing.

### Supabase Setup
Ensure your Supabase project has:
- The `pgvector` extension enabled
- The `documents` table created with the correct schema
- Proper RLS (Row Level Security) policies if needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

[PrudhviPuli](https://github.com/PrudhviPuli)

## Acknowledgments

- Built with [LangChain](https://www.langchain.com/)
- Powered by [OpenAI](https://openai.com/)
- Database by [Supabase](https://supabase.com/)


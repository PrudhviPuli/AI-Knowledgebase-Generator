# API Documentation

## 1. Overview

The AI Knowledgebase Generator API provides endpoints for user authentication, GitHub repository processing, and knowledge base generation. The API enables users to register accounts, authenticate, upload GitHub repositories for indexing, and generate AI-powered onboarding guides from codebases.

The system processes repositories by cloning them, extracting relevant code files, splitting them into chunks, generating embeddings, and storing them in a vector database for semantic search and retrieval.

## 2. Intended Audience

This API documentation is intended for:
- Frontend developers integrating with the API
- Third-party developers building applications that consume the API
- API consumers who need to understand request/response formats and authentication requirements

## 3. Base URL

```
http://localhost:8000
```

All API endpoints are relative to this base URL.

## 4. Authentication

The API uses JSON Web Tokens (JWT) for authentication. Most endpoints require authentication, except for user registration and login.

### Obtaining a Token

1. Register a new account using the `/signup` endpoint
2. Authenticate using the `/login` endpoint with your credentials
3. The response includes a `token` field that should be stored securely

### Using the Token

Include the token in the `Authorization` header of authenticated requests:

```
Authorization: Bearer <your-token-here>
```

### Token Expiration

Tokens expire after 1 hour. If a token expires, you will receive a `403 Forbidden` response. You must authenticate again using the `/login` endpoint to obtain a new token.

## 5. Endpoints

### POST /signup

**Description**

Creates a new user account. The provided email and password are validated, and the password is securely hashed before storage. Email addresses are automatically converted to lowercase.

**Request**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response**

```json
{
  "message": "Successfully got the request"
}
```

**Status Codes**
- `200 OK` - Account created successfully
- `500 Internal Server Error` - Server error during account creation

---

### POST /login

**Description**

Authenticates a user with their email and password. Returns a JWT token and user name upon successful authentication. The token must be included in subsequent authenticated requests.

**Request**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response**

```json
{
  "name": "john doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes**
- `200 OK` - Authentication successful
- `401 Unauthorized` - Invalid email or password, or user not found
- `500 Internal Server Error` - Server error during authentication

---

### GET /me

**Description**

Verifies that the provided authentication token is valid. This endpoint is useful for checking if a user session is still active or validating tokens stored in client applications.

**Authentication Required:** Yes

**Request**

No request body

**Headers**
```
Authorization: Bearer <your-token-here>
```

**Response**

```json
{
  "message": "successfully authenticated"
}
```

**Status Codes**
- `200 OK` - Token is valid and user is authenticated
- `401 Unauthorized` - No token provided
- `403 Forbidden` - Invalid or expired token

---

### GET /download-repo

**Description**

Downloads a GitHub repository from the provided URL, processes all relevant code files, generates embeddings, and stores them in the vector database for semantic search. The repository is cloned locally, files are filtered by extension (supporting TypeScript, JavaScript, Python, Java, Go, Rust, Markdown, and other common formats), split into chunks, and indexed.

**Request**

Query Parameters:
- `repolink` (required) - The GitHub repository URL (e.g., `https://github.com/user/repo.git`)

**Example Request**
```
GET /download-repo?repolink=https://github.com/user/repo.git
```

**Response**

```json
{
  "message": "Downloaded + indexed repo-name",
  "repo_id": "a1b2c3d4e5f6...",
  "chunks": 1234
}
```

**Status Codes**
- `200 OK` - Repository successfully downloaded and indexed
- `400 Bad Request` - Missing or invalid `repolink` query parameter
- `500 Internal Server Error` - Error during repository cloning, processing, or indexing

**Notes**
- The repository is cloned to a temporary directory and processed
- Only files with allowed extensions are processed (ignores node_modules, .git, dist, build, etc.)
- Processing may take several minutes for large repositories
- The `repo_id` is a SHA-256 hash of the repository URL and can be used to reference the indexed repository

---

### GET /

**Description**

Generates an AI-powered onboarding guide for a codebase stored in the knowledge base. This endpoint uses the indexed repository data to create a comprehensive guide that includes an introduction, explanation of the codebase, and environment setup instructions.

**Request**

No request body

**Response**

The response is a plain text string containing the generated onboarding guide in the following format:

```
Introduction:
[Short paragraph introducing users to the codebase, including name, tech stack, purpose, and goals]

Explanation:
[Detailed paragraph explaining what the codebase does, problems it solves, main features, and how components connect]

Environment Setup:
[Instructions for setting up the codebase, including installation, cloning, dependencies, and startup procedures]
```

**Status Codes**
- `200 OK` - Onboarding guide generated successfully
- `500 Internal Server Error` - Error during guide generation

**Notes**
- This endpoint requires that repositories have been indexed using the `/download-repo` endpoint
- The guide is generated using AI and may take some time to process
- The response format is plain text, not JSON

## 6. Error Handling

The API uses standard HTTP status codes to indicate success or failure:

### Success Codes
- `200 OK` - Request completed successfully

### Client Error Codes
- `400 Bad Request` - Invalid request parameters or missing required fields
- `401 Unauthorized` - Authentication required or invalid credentials
- `403 Forbidden` - Valid token required but not provided, or token is expired
- `404 Not Found` - Endpoint does not exist

### Server Error Codes
- `500 Internal Server Error` - An unexpected error occurred on the server

### Error Response Format

Error responses follow this general format:

```json
{
  "message": "Error description",
  "error": "Additional error details (optional)"
}
```

**Example Error Responses**

```json
{
  "message": "Authentication Failed Please Try Again"
}
```

```json
{
  "message": "repo query param required"
}
```

```json
{
  "message": "Invalid or Expired Token"
}
```

```json
{
  "error": "Internal server error"
}
```

## 7. Rate Limits

Rate limiting is not currently implemented. However, to ensure fair usage and system stability, clients should:

- Avoid making excessive requests in short time periods
- Implement appropriate retry logic with exponential backoff for failed requests
- Be mindful that repository processing operations are resource-intensive and may take several minutes

Future versions of the API may implement rate limiting. Clients should handle `429 Too Many Requests` responses gracefully.

## 8. Versioning

The API does not currently implement versioning. All endpoints are available at the base URL without version prefixes.

Future versions may introduce versioning through URL paths (e.g., `/v1/`, `/v2/`) or headers. When versioning is implemented, this documentation will be updated accordingly.

## 9. Changelog

### Version 1.0.0 (Current)

**Initial Release**

- User registration endpoint (`POST /signup`)
- User authentication endpoint (`POST /login`)
- Authentication status check endpoint (`GET /me`)
- Repository download and indexing endpoint (`GET /download-repo`)
- Onboarding guide generation endpoint (`GET /`)

**Features:**
- JWT-based authentication with 1-hour token expiration
- GitHub repository cloning and processing
- Multi-language code file support (TypeScript, JavaScript, Python, Java, Go, Rust, Markdown, etc.)
- Vector embedding generation and storage
- AI-powered onboarding guide generation


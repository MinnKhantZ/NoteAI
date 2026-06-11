# NoteAI Backend - AI Writing Assistant API 🤖📝

A lightweight Express.js API server that powers AI-powered writing suggestions for the NoteAI mobile application using Google Gemini AI.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express.js](https://img.shields.io/badge/Express.js-4.21.2-black)
![Google Gemini](https://img.shields.io/badge/Google-Gemini-orange)
![Render](https://img.shields.io/badge/Deployed%20on-Render-blue)

## ✨ Features

### 🚀 Core API
- **AI Writing Suggestions**: Generate intelligent note improvement suggestions
- **RESTful Design**: Clean API endpoints with proper HTTP methods
- **JSON Communication**: Structured request/response format
- **Error Handling**: Comprehensive error management and logging

### 🔧 Technical Features
- **Google Gemini Integration**: Latest Gemini 2.5 Flash model
- **CORS Enabled**: Cross-origin requests from mobile apps
- **Request Logging**: Morgan middleware for HTTP request logging
- **Environment Configuration**: Secure API key management with dotenv
- **Production Ready**: Optimized for cloud deployment

### 📊 AI Capabilities
- **Contextual Analysis**: Understands note content and context
- **Improvement Suggestions**: Provides 3 targeted suggestions per request
- **Natural Language**: Human-like writing recommendations
- **Fast Processing**: Optimized prompts for quick responses

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21.2
- **AI Engine**: Google Generative AI (Gemini 2.5 Flash)
- **Security**: CORS, environment variables
- **Logging**: Morgan HTTP request logger
- **Deployment**: Render (cloud platform)
- **Process Management**: Built-in Node.js cluster support

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Google AI Studio Account**: For Gemini API key
- **Git**: For version control

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd NoteAIBackend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add your Google Gemini API key:

```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
PORT=3000
```

**Get your API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### 4. Start Development Server

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## 📁 Project Structure

```
NoteAIBackend/
├── index.js              # Main Express application
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (create this)
├── .gitignore           # Git ignore rules
├── node_modules/        # Dependencies
└── README.md            # This file
```

## 🔧 API Documentation

### Base URL
```
https://noteaibackend.onrender.com
```

### Endpoints

#### Health Check
```http
GET /
```
**Response:** `200 OK` (empty body)

#### Get AI Suggestions
```http
POST /suggestions
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Your note content here that needs improvement suggestions..."
}
```

**Response (Success - 200):**
```json
[
  "Consider adding more specific details to make your note more actionable.",
  "Try organizing your thoughts with bullet points for better readability.",
  "Add a conclusion or summary to wrap up your main points."
]
```

**Response (Error - 500):**
```json
{
  "error": "Error processing request"
}
```

### Request/Response Examples

**cURL Example:**
```bash
curl -X POST https://noteaibackend.onrender.com/suggestions \
  -H "Content-Type: application/json" \
  -d '{"content": "This is a sample note that needs improvement."}'
```

**JavaScript (fetch) Example:**
```javascript
const response = await fetch('https://noteaibackend.onrender.com/suggestions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: 'Your note content here...'
  })
});

const suggestions = await response.json();
console.log(suggestions); // ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
```

## 🎯 AI Processing Logic

### Prompt Engineering

The API uses a carefully crafted prompt to ensure consistent, high-quality suggestions:

```
"Please review the following text and provide exactly three improvement suggestions. Each suggestion should be in a separate sentence and separated by \n.
Text: ${content}
Suggestions (3 sentences, one per line):"
```

### Response Processing

1. **Raw Response**: Gemini returns formatted text
2. **Parsing**: Split by newlines and clean whitespace
3. **Validation**: Ensure exactly 3 suggestions
4. **Fallback**: Handle edge cases with sentence splitting

### AI Model Configuration

- **Model**: `gemini-2.5-flash`
- **Temperature**: Default (balanced creativity/consistency)
- **Safety Settings**: Default Google AI safety filters

## 🔐 Security & Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Gemini API key | Yes |
| `PORT` | Server port (default: 3000) | No |

### Security Measures

- **API Key Protection**: Never commit `.env` file
- **CORS Configuration**: Allows cross-origin requests from mobile apps
- **Input Validation**: Basic content validation
- **Error Sanitization**: Generic error messages to prevent information leakage

## 🚀 Deployment

### Deploy to Render

1. **Connect Repository**: Link your GitHub repo to Render
2. **Build Settings**:
   - **Environment**: Node.js
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. **Environment Variables**: Add `GOOGLE_API_KEY` and `PORT`
4. **Deploy**: Automatic deployments on git push

### Environment Variables for Production

```env
GOOGLE_API_KEY=your_production_api_key
PORT=10000  # Render assigns dynamic ports
```

### Current Deployment

The API is currently deployed at: `https://noteaibackend.onrender.com`

## 🧪 Development

### Available Scripts

```bash
npm start    # Start the server
```

### Local Testing

```bash
# Test health endpoint
curl http://localhost:3000/

# Test suggestions endpoint
curl -X POST http://localhost:3000/suggestions \
  -H "Content-Type: application/json" \
  -d '{"content": "Test note content"}'
```

### Logging

The server uses Morgan middleware with 'dev' format for request logging:

```
GET / 200 2ms
POST /suggestions 200 1250ms
```

## 📊 Performance

### Response Times
- **Health Check**: ~2ms
- **AI Suggestions**: ~800-1500ms (depends on content length and AI processing)

### Rate Limiting
- No explicit rate limiting implemented
- Consider adding if deployed for public use

### Caching
- No caching implemented (stateless API)
- Consider Redis caching for frequently requested suggestions

## 🐛 Troubleshooting

### Common Issues

**"GOOGLE_API_KEY not found":**
```bash
# Check .env file exists and has correct key
cat .env
# Restart server after adding key
npm start
```

**"Error processing request":**
- Check Google AI Studio API key validity
- Verify internet connection
- Check server logs for detailed error

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm start
```

**CORS errors:**
- Ensure CORS middleware is properly configured
- Check request headers from client app

## 🔍 Monitoring

### Health Checks

The root endpoint (`/`) serves as a health check:

```bash
curl https://noteaibackend.onrender.com/
# Should return 200 OK
```

### Logs

- **Development**: Console output with Morgan logs
- **Production**: Render dashboard logs
- **Errors**: Check server console for Gemini API errors

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google AI** for the powerful Gemini API
- **Express.js Team** for the robust web framework
- **Render** for reliable hosting platform
- **OpenAI Community** for inspiring AI integration patterns

---

**Built with ❤️ to enhance writing through AI**</content>
<parameter name="filePath">c:\Users\Min\Documents\NoteAI\NoteAIBackend\README.md
# Predusk Assignment

This project is a full-stack application consisting of a Python backend using FastAPI and a Next.js frontend.

## Overview

- **Backend**: Built with FastAPI, provides AI-powered API endpoints using Cohere for language models, Qdrant for vector database, and LangChain for orchestration.
- **Frontend**: Built with Next.js, provides a modern web interface.

## Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r req.txt
   ```

4. Set up environment variables (create a `.env` file if needed):
   - Configure API keys for Cohere, etc.

5. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will be available at `http://localhost:8000`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Both Services

To run both frontend and backend simultaneously:

1. Open two terminals.
2. In one terminal, run the backend as described above.
3. In the other terminal, run the frontend as described above.

## Project Structure

```
predusk_assignment/
├── backend/
│   ├── main.py          # FastAPI application
│   ├── req.txt          # Python dependencies
│   └── .gitignore       # Python-specific ignores
├── frontend/
│   ├── src/
│   │   └── app/         # Next.js app directory
│   ├── package.json     # Node.js dependencies and scripts
│   ├── next.config.ts   # Next.js configuration
│   └── .gitignore       # Next.js-specific ignores
└── README.md            # This file
```
## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test thoroughly.
5. Submit a pull request.

## License

This project is licensed under the MIT License.

Predusk Assignment

This project is a full-stack application consisting of a Python backend using FastAPI and a Next.js frontend.

Overview

Backend

Built with FastAPI

Uses Gemini Flash (latest) as the Large Language Model (LLM)

Uses Qdrant (Free Tier) as the vector database

Uses LangChain for orchestration

Hosted locally and exposed using ngrok, as heavy LLM-based services cannot be hosted for free on cloud platforms

Frontend

Built with Next.js

Hosted on Vercel

Provides a modern and responsive user interface

Tech Stack

LLM: Gemini Flash (latest)

Vector Database: Qdrant (Free Tier)

Backend Framework: FastAPI

Frontend Framework: Next.js

Hosting

Frontend: Vercel

Backend: Local server + ngrok

Prerequisites

Python 3.8+

Node.js 18+

npm or yarn

ngrok (free tier)

Backend Setup

Navigate to the backend directory:

cd backend


Create a virtual environment (optional but recommended):

python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate


Install dependencies:

pip install -r req.txt


Set up environment variables (create a .env file):

Gemini API key

Qdrant configuration

Any additional required keys

Run the FastAPI server:

uvicorn main:app --reload


Expose the backend using ngrok:

ngrok http 8000


The backend will be accessible at:

http://localhost:8000

or via the ngrok-generated public URL

Frontend Setup

Navigate to the frontend directory:

cd frontend


Install dependencies:

npm install
# or
yarn install


Configure environment variables:

Add the ngrok backend URL to .env.local

Run the development server:

npm run dev
# or
yarn dev


Open the app in your browser:

http://localhost:3000

Deployment
Frontend (Vercel)

Deployed on Vercel

Environment variables are configured via the Vercel dashboard

Automatically redeploys on each push to the main branch

Backend (Local + ngrok)

Runs locally due to free-tier hosting limitations for heavy LLM workloads

ngrok is used to expose the backend publicly for frontend access

Running Both Services

Open two terminals

Terminal 1:

Run FastAPI

Run ngrok

Terminal 2:

Run the Next.js frontend

Ensure the frontend is pointing to the correct ngrok backend URL

Project Structure
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
│   └── .gitignore       # Frontend ignores
└── README.md            # Project documentation

Contributing

Fork the repository

Create a new feature branch

Make your changes

Test thoroughly

Submit a pull request

License

This project is licensed under the MIT License.

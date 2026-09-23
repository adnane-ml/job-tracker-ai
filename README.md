# Job Tracker AI

> AI-powered job application tracker — analyze offers, generate cover letters, track your pipeline.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![Mistral](https://img.shields.io/badge/LLM-Mistral%207B-orange)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

---

## Overview

Job hunting means processing dozens of offers manually. This project automates job offer analysis using a local LLM (Mistral 7B via Ollama) — no sensitive data sent to the cloud.

---

## Features

- **Offer analysis** — automatic extraction of required skills, summary and application tips
- **Cover letter generation** — personalized letter based on candidate profile and job description
- **Application tracking** — save offers and manage status (To apply / Applied / Interview / Rejected)

---

## Architecture

```
Client (React)
     ↓ HTTP
FastAPI :8000
     ↓ HTTP
Ollama :11434 (Mistral 7B — local inference)
     ↓
SQLite (persistent Docker volume)
```


---

## Tech Stack

| Component       | Technology                  |
|-----------------|-----------------------------|
| Frontend        | React + Vite                |
| Backend         | FastAPI + Uvicorn           |
| LLM             | Mistral 7B via Ollama       |
| Database        | SQLite + SQLAlchemy         |
| Containerization| Docker + Docker Compose     |

---

## Getting Started

### Prerequisites

- Docker Desktop
- [Ollama](https://ollama.com) installed and running
- Mistral model pulled: `ollama pull mistral`

### Run

```bash
git clone https://github.com/adnane-ml/job-tracker-ai.git
cd job-tracker-ai

cp frontend/.env.example frontend/.env

docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Project Structure

```
job-tracker-ai/
├── frontend/               ← React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── .env.example
├── backend/                ← FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   └── api/
│   │       ├── analyze.py      ← AI extraction
│   │       ├── jobs.py         ← CRUD operations
│   │       └── coverletter.py  ← letter generation
│   └── requirements.txt
└── docker-compose.yml
```


---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Analyze a job offer |
| POST | `/jobs` | Save an application |
| GET | `/jobs` | List all applications |
| PATCH | `/jobs/{id}/status` | Update application status |
| POST | `/coverletter` | Generate a cover letter |

---

## Author

**Adnane EL HISSEN** — ML Engineer | Backend & Embedded Systems  
Casablanca, Morocco  
[GitHub](https://github.com/adnane-ml)
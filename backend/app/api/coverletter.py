import os
import httpx
import re
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

class CoverLetterRequest(BaseModel):
    job_title: str
    company: str
    skills: list
    summary: str
    candidate_background: str

@router.post("/coverletter")
async def generate_cover_letter(payload: CoverLetterRequest):
    prompt = f"""Rédige une lettre de motivation professionnelle en français pour ce poste.

Poste: {payload.job_title} chez {payload.company}
Description: {payload.summary}
Compétences requises: {', '.join(payload.skills)}
Profil du candidat: {payload.candidate_background}

Lettre courte (3 paragraphes), ton professionnel, directe."""

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            f"{OLLAMA_URL}/api/generate",
            json={"model": "mistral", "prompt": prompt, "stream": False}
        )

    return {"letter": response.json()["response"]}
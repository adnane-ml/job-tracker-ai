import os
import httpx
import json
from fastapi import APIRouter
from pydantic import BaseModel

import re

router = APIRouter()
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

class JobOffer(BaseModel):
    description: str

@router.post("/analyze")
async def analyze_job(payload: JobOffer):
    prompt = f"""Analyse cette offre. Réponds UNIQUEMENT avec ce JSON, rien d'autre :
{{"skills": ["skill1", "skill2"], "summary": "résumé en une phrase", "match_tips": ["conseil1", "conseil2"]}}

Offre: {payload.description[:300]}"""

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            f"{OLLAMA_URL}/api/generate",
            json={"model": "llama3.2", "prompt": prompt, "stream": False}
        )

    raw = response.json()["response"]
    try:
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        parsed = json.loads(match.group()) if match else {"skills": [], "summary": raw, "match_tips": []}
    except:
        parsed = {"skills": [], "summary": raw, "match_tips": []}
    
    return parsed
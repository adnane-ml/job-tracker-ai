from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.analyze import router as analyze_router
from app.api.jobs import router as jobs_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)
app.include_router(jobs_router)

@app.get("/health")
def health():
    return {"status": "ok"}
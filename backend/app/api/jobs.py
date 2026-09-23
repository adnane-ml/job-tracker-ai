from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import Job, get_db
import json
from pydantic import BaseModel

router = APIRouter()

class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    skills: list
    summary: str
    status: str = "À postuler"

class StatusUpdate(BaseModel):
    status: str

@router.post("/jobs")
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    job = Job(
        title=payload.title,
        company=payload.company,
        description=payload.description,
        skills=json.dumps(payload.skills),
        summary=payload.summary,
        status=payload.status
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return {"id": job.id, "status": "saved"}

@router.get("/jobs")
def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    return [{"id": j.id, "title": j.title, "company": j.company,
             "skills": json.loads(j.skills), "summary": j.summary,
             "status": j.status, "created_at": str(j.created_at)} for j in jobs]

@router.patch("/jobs/{job_id}/status")
def update_status(job_id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.status = payload.status
    db.commit()
    return {"id": job_id, "status": job.status}
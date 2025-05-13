from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from pathlib import Path
import json
import os
from datetime import datetime
from .client import MedoraClient

app = FastAPI(
    title="Medora Data Generation API",
    description="YC Demo - Generate synthetic medical data with customizable parameters",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Initialize the Medora client
client = MedoraClient()

class GenerationConfig(BaseModel):
    """Configuration for data generation request"""
    num_records: int = 10
    seed: Optional[int] = None
    state: str = "Massachusetts"
    gender: Optional[str] = None
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    modules: Optional[List[str]] = None
    export_format: str = "json"
    output_dir: str = "generated_data"
    batch_name: Optional[str] = None

class BatchConfig(BaseModel):
    """Configuration for batch generation request"""
    configs: List[GenerationConfig]
    output_dir: str = "generated_data"

# Store job status
jobs: Dict[str, Dict[str, Any]] = {}

@app.get("/")
async def root():
    """Welcome endpoint"""
    return {"message": "Welcome to Medora Data Generation API"}

@app.post("/generate")
async def generate_data(config: GenerationConfig, background_tasks: BackgroundTasks):
    """Generate synthetic medical data with the given configuration"""
    job_id = f"job_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Set up job tracking
    jobs[job_id] = {
        "status": "started",
        "config": config.dict(),
        "start_time": datetime.now().isoformat(),
        "output_path": None,
        "error": None
    }
    
    def generate():
        try:
            # Generate data
            data = client.generate_medical_data(
                num_records=config.num_records,
                seed=config.seed,
                state=config.state,
                gender=config.gender,
                age_min=config.age_min,
                age_max=config.age_max,
                modules=config.modules,
                export_format=config.export_format
            )
            
            # Save data
            filename = f"{config.batch_name or job_id}.json"
            output_path = client.save_generated_data(
                data,
                output_dir=config.output_dir,
                filename=filename
            )
            
            # Update job status
            jobs[job_id].update({
                "status": "completed",
                "output_path": output_path,
                "end_time": datetime.now().isoformat()
            })
        
        except Exception as e:
            jobs[job_id].update({
                "status": "failed",
                "error": str(e),
                "end_time": datetime.now().isoformat()
            })
    
    background_tasks.add_task(generate)
    
    return {
        "job_id": job_id,
        "status": "started",
        "message": "Data generation started"
    }

@app.post("/generate/batch")
async def generate_batch(config: BatchConfig, background_tasks: BackgroundTasks):
    """Generate multiple datasets with different configurations"""
    job_id = f"batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    jobs[job_id] = {
        "status": "started",
        "config": config.dict(),
        "start_time": datetime.now().isoformat(),
        "output_paths": [],
        "error": None
    }
    
    def generate_batch():
        try:
            output_paths = []
            for cfg in config.configs:
                data = client.generate_medical_data(**cfg.dict())
                filename = f"{cfg.batch_name or f'batch_{len(output_paths)+1}'}.json"
                path = client.save_generated_data(
                    data,
                    output_dir=config.output_dir,
                    filename=filename
                )
                output_paths.append(path)
            
            jobs[job_id].update({
                "status": "completed",
                "output_paths": output_paths,
                "end_time": datetime.now().isoformat()
            })
        
        except Exception as e:
            jobs[job_id].update({
                "status": "failed",
                "error": str(e),
                "end_time": datetime.now().isoformat()
            })
    
    background_tasks.add_task(generate_batch)
    
    return {
        "job_id": job_id,
        "status": "started",
        "message": "Batch generation started"
    }

@app.get("/jobs/{job_id}")
async def get_job_status(job_id: str):
    """Get the status of a specific job"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

@app.get("/modules")
async def list_modules():
    """List available Synthea modules"""
    try:
        modules = client.list_available_modules()
        return {"modules": modules}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/demo")
async def generate_demo(background_tasks: BackgroundTasks):
    """Generate a demo dataset with various configurations"""
    job_id = f"demo_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    jobs[job_id] = {
        "status": "started",
        "start_time": datetime.now().isoformat(),
        "output_paths": None,
        "error": None
    }
    
    def generate_demo():
        try:
            results = client.generate_demo_dataset()
            
            jobs[job_id].update({
                "status": "completed",
                "output_paths": results,
                "end_time": datetime.now().isoformat()
            })
        
        except Exception as e:
            jobs[job_id].update({
                "status": "failed",
                "error": str(e),
                "end_time": datetime.now().isoformat()
            })
    
    background_tasks.add_task(generate_demo)
    
    return {
        "job_id": job_id,
        "status": "started",
        "message": "Demo generation started"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

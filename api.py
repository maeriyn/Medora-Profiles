from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import json
import asyncio
from typing import Optional, List
import signal

# Graceful shutdown handler
def shutdown_handler(signum, frame):
    print("Shutting down gracefully...")
    os._exit(0)

# Register signal handlers
signal.signal(signal.SIGINT, shutdown_handler)
signal.signal(signal.SIGTERM, shutdown_handler)

app = FastAPI(
    title="Synthea API",
    description="API for generating synthetic medical records using Synthea",
    version="1.0.0",
    docs_url="/v1/docs",
    redoc_url="/v1/redoc",
    openapi_url="/v1/openapi.json"
)

class SyntheaConfig(BaseModel):
    num_patients: int = 10
    population: Optional[dict] = None
    modules: Optional[List[str]] = None

@app.get("/v1/", tags=["root"])
async def root():
    return {"message": "Welcome to the Synthea API"}

@app.post("/v1/generate", tags=["generation"])
async def generate_data(config: SyntheaConfig):
    try:
        synthea_path = os.path.join("app", "services", "medical", "synthea")
        run_script = os.path.join(synthea_path, "run_synthea")
        
        # Check if the Synthea directory and script exist
        if not os.path.exists(synthea_path):
            raise HTTPException(status_code=500, detail=f"Synthea path not found: {synthea_path}")
        if not os.path.exists(run_script):
            raise HTTPException(status_code=500, detail=f"Synthea script not found: {run_script}")
        if not os.access(run_script, os.X_OK):
            raise HTTPException(status_code=500, detail=f"Synthea script is not executable: {run_script}")
        
        # Build the command
        cmd = [run_script, "-p", str(config.num_patients)]
        if config.modules:
            for module in config.modules:
                cmd.extend(["-m", module])
        
        # Run the command asynchronously
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=synthea_path
        )
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Synthea generation failed: {stderr.decode().strip()}")
        
        return {
            "message": "Data generation complete",
            "output_dir": os.path.join(synthea_path, "output"),
            "stdout": stdout.decode().strip(),
            "stderr": stderr.decode().strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/v1/status", tags=["status"])
async def get_status():
    return {"status": "running"}

@app.get("/v1/test", tags=["test"])
async def test():
    return {"message": "Test endpoint is working"}

@app.get("/health", tags=["status"])
async def health_check():
    """Endpoint for basic health check"""
    return {"status": "healthy"}

@app.get("/domains", tags=["info"])
async def list_domains():
    """List available data domains/modules"""
    return {"domains": ["diabetes", "hypertension", "heart_disease"]}

if __name__ == "__main__":
    import uvicorn
    print("Starting API server at http://0.0.0.0:8000")
    print("Available endpoints:")
    print("  - GET /v1/")
    print("  - GET /v1/test")
    print("  - GET /v1/status") 
    print("  - POST /v1/generate")
    print("  - GET /v1/redoc (Redoc UI)")
    
    uvicorn.run(
        app,
        host="0.0.0.0", 
        port=8000,
        log_level="info",
        reload=True
    )
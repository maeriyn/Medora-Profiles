from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import os
import json
from typing import Optional, List

app = FastAPI(
    title="Synthea API",
    description="API for generating synthetic medical records using Synthea"
)

class SyntheaConfig(BaseModel):
    num_patients: int = 10
    population: Optional[dict] = None
    modules: Optional[List[str]] = None
    
@app.post("/generate")
async def generate_data(config: SyntheaConfig):
    try:
        synthea_path = os.path.join("app", "services", "medical", "synthea")
        cmd = [os.path.join(synthea_path, "run_synthea")]
        
        # Add number of patients
        cmd.extend(["-p", str(config.num_patients)])
        
        # Add any specific modules if provided
        if config.modules:
            for module in config.modules:
                cmd.extend(["-m", module])
                
        # Run Synthea
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=synthea_path  # Set working directory to Synthea path
        )
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Synthea generation failed: {stderr.decode()}")
            
        return {"message": "Data generation complete", "output_dir": os.path.join(synthea_path, "output")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/status")
async def get_status():
    return {"status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
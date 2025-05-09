from fastapi import FastAPI, HTTPException, Query
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
from app.core.config import settings
from app.core.registry import generator_registry
from app.core.base_generator import GeneratorConfig
from app.services.medical.synthea_generator import SyntheaGenerator, MedicalGeneratorConfig

app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs"
)

# Register available generators
generator_registry.register("medical", SyntheaGenerator)

@app.get("/domains")
async def list_domains():
    """List all available data generation domains"""
    return {"domains": generator_registry.list_domains()}

class SyntheaRequest(BaseModel):
    num_records: int = Field(default=10, gt=0, description="Number of patient records to generate")
    seed: Optional[int] = Field(default=None, description="Random seed for reproducible generation")
    state: str = Field(default="Massachusetts", description="US state for population demographics")
    city: Optional[str] = Field(default=None, description="Specific city for demographics")
    population: Optional[Dict[str, Any]] = Field(default=None, description="Custom population demographics")
    gender: Optional[str] = Field(default=None, pattern="^(M|F)$", description="Filter by gender (M or F)")
    age_min: Optional[int] = Field(default=None, ge=0, lt=150, description="Minimum age in years")
    age_max: Optional[int] = Field(default=None, ge=0, lt=150, description="Maximum age in years")
    modules: Optional[List[str]] = Field(default=None, description="Specific Synthea modules to include")
    export_format: Optional[str] = Field(
        default="json", 
        pattern="^(json|csv|fhir)$",
        description="Output format for the generated data"
    )

class GenerateResponse(BaseModel):
    status: str
    data: Dict[str, Any]
    metadata: Dict[str, Any]

@app.post("/generate/{domain}", response_model=GenerateResponse)
async def generate_data(
    domain: str,
    config: SyntheaRequest,
    include_metadata: bool = Query(True, description="Include generation metadata in response")
):
    """
    Generate synthetic data for the specified domain.
    
    Currently supported domains:
    - medical: Uses Synthea to generate synthetic medical records
    
    Parameters:
    - domain: The data domain to generate
    - config: Domain-specific configuration
    - include_metadata: Whether to include generation metadata
    """
    try:
        generator = generator_registry.get_generator(domain)
        
        if domain == "medical":
            # Convert the Pydantic model to dict and filter out None values
            config_dict = {k: v for k, v in config.dict().items() if v is not None}
            generator_config = MedicalGeneratorConfig(**config_dict)
        else:
            generator_config = GeneratorConfig(**config.dict())
            
        # Pre-generation setup
        generator.pre_generate(generator_config)
        
        # Generate data
        data = generator.generate(generator_config)
        
        # Post-generation processing
        data = generator.post_generate(data)
        
        # Validate generated data
        if not generator.validate(data):
            raise HTTPException(
                status_code=500,
                detail="Generated data failed validation"
            )
        
        response = {
            "status": "success",
            "data": data,
            "metadata": {
                "config": config.dict(),
                "generator": domain,
                "schema_version": "1.0"
            } if include_metadata else {}
        }
        
        return response
        
    except KeyError:
        raise HTTPException(
            status_code=404, 
            detail=f"Domain '{domain}' not found"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("/schema/{domain}")
async def get_schema(domain: str):
    """Get the schema for a specific domain"""
    try:
        generator = generator_registry.get_generator(domain)
        return generator.get_schema()
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Domain '{domain}' not found")
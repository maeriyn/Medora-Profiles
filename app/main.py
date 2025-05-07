from fastapi import FastAPI, HTTPException
from typing import Dict, Any
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

@app.post("/generate/{domain}")
async def generate_data(domain: str, config: Dict[str, Any]):
    """Generate data for a specific domain"""
    try:
        generator = generator_registry.get_generator(domain)
        
        # Create appropriate config based on domain
        if domain == "medical":
            generator_config = MedicalGeneratorConfig(**config)
        else:
            generator_config = GeneratorConfig(**config)
            
        data = generator.generate(generator_config)
        return {"status": "success", "data": data}
        
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Domain '{domain}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/schema/{domain}")
async def get_schema(domain: str):
    """Get the schema for a specific domain"""
    try:
        generator = generator_registry.get_generator(domain)
        return generator.get_schema()
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Domain '{domain}' not found")
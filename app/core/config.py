from typing import Dict, Any
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Data Generation Framework"
    DEBUG: bool = False
    
    # Database settings if needed
    DATABASE_URL: str = ""
    
    # Generator specific settings
    MEDICAL_DATA_PATH: str = "synthea"
    LEGAL_DATA_PATH: str = "legal_data"
    EDUCATION_DATA_PATH: str = "education_data"
    
    # API Settings
    API_V1_PREFIX: str = "/api/v1"
    
    class Config:
        env_file = ".env"

settings = Settings()
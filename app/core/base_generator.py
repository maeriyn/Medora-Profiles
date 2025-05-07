from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from pydantic import BaseModel

class GeneratorConfig(BaseModel):
    """Base configuration class for all generators"""
    num_records: int = 10
    output_format: str = "json"
    seed: Optional[int] = None

class BaseGenerator(ABC):
    """Abstract base class for all data generators"""
    
    @abstractmethod
    def generate(self, config: GeneratorConfig) -> Dict[str, Any]:
        """Generate data based on the provided configuration"""
        pass
    
    @abstractmethod
    def validate(self, data: Dict[str, Any]) -> bool:
        """Validate generated data"""
        pass
    
    @abstractmethod
    def get_schema(self) -> Dict[str, Any]:
        """Return the schema for the generated data"""
        pass
    
    def pre_generate(self, config: GeneratorConfig) -> None:
        """Hook for pre-generation setup"""
        pass
    
    def post_generate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Hook for post-generation processing"""
        return data
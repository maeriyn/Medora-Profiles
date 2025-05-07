from typing import Dict, Type
from .base_generator import BaseGenerator

class GeneratorRegistry:
    """Registry for managing all data generators"""
    
    def __init__(self):
        self._generators: Dict[str, Type[BaseGenerator]] = {}
    
    def register(self, domain: str, generator_cls: Type[BaseGenerator]) -> None:
        """Register a new generator for a specific domain"""
        self._generators[domain] = generator_cls
    
    def get_generator(self, domain: str) -> Type[BaseGenerator]:
        """Get a generator instance for a specific domain"""
        if domain not in self._generators:
            raise KeyError(f"No generator registered for domain: {domain}")
        return self._generators[domain]()
    
    def list_domains(self) -> list[str]:
        """List all available data generation domains"""
        return list(self._generators.keys())

# Global registry instance
generator_registry = GeneratorRegistry()
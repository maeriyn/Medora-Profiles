from typing import Optional, Dict, Any, List
import requests
import json
from pathlib import Path

class MedoraClient:
    """Client for interacting with Medora's synthetic data generation API"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        """
        Initialize the Medora client.
        
        Args:
            base_url: Base URL of the Medora API server
        """
        self.base_url = base_url.rstrip('/')
        
    def generate_medical_data(
        self,
        num_records: int = 10,
        seed: Optional[int] = None,
        state: str = "Massachusetts",
        gender: Optional[str] = None,
        age_min: Optional[int] = None,
        age_max: Optional[int] = None,
        modules: Optional[List[str]] = None,
        export_format: str = "json"
    ) -> Dict[str, Any]:
        """
        Generate synthetic medical records.
        
        Args:
            num_records: Number of patient records to generate
            seed: Random seed for reproducible generation
            state: US state for population demographics
            gender: Filter by gender (M or F)
            age_min: Minimum age in years
            age_max: Maximum age in years
            modules: Specific Synthea modules to include
            export_format: Output format (json, csv, or fhir)
            
        Returns:
            Dictionary containing generated medical data
        """
        endpoint = f"{self.base_url}/generate/medical"
        
        payload = {
            "num_records": num_records,
            "seed": seed,
            "state": state,
            "gender": gender,
            "age_min": age_min,
            "age_max": age_max,
            "modules": modules,
            "export_format": export_format
        }
        
        # Remove None values
        payload = {k: v for k, v in payload.items() if v is not None}
        
        response = requests.post(endpoint, json=payload)
        response.raise_for_status()
        
        return response.json()
    
    def save_generated_data(
        self,
        data: Dict[str, Any],
        output_dir: str = "generated_data",
        filename: str = "medical_data.json"
    ) -> str:
        """
        Save generated data to a file.
        
        Args:
            data: Generated data to save
            output_dir: Directory to save the file in
            filename: Name of the output file
            
        Returns:
            Path to the saved file
        """
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        file_path = output_path / filename
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
            
        return str(file_path)
    
    def list_available_modules(self) -> List[str]:
        """Get list of available Synthea modules"""
        endpoint = f"{self.base_url}/domains"
        response = requests.get(endpoint)
        response.raise_for_status()
        return response.json()["domains"]
    
    def generate_batch(
        self,
        configs: List[Dict[str, Any]],
        output_dir: str = "generated_data"
    ) -> List[str]:
        """
        Generate multiple datasets with different configurations.
        
        Args:
            configs: List of configurations for data generation
            output_dir: Directory to save the generated files
            
        Returns:
            List of paths to generated files
        """
        generated_files = []
        for i, config in enumerate(configs):
            data = self.generate_medical_data(**config)
            filename = f"medical_data_{i+1}.json"
            file_path = self.save_generated_data(data, output_dir, filename)
            generated_files.append(file_path)
        return generated_files

    def get_server_status(self) -> Dict[str, Any]:
        """
        Check the status of the Medora API server.
        
        Returns:
            Dictionary containing server status information
        """
        endpoint = f"{self.base_url}/health"
        response = requests.get(endpoint)
        response.raise_for_status()
        return response.json()

    def generate_demo_dataset(
        self,
        output_dir: str = "demo_data"
    ) -> Dict[str, str]:
        """
        Generate a comprehensive demo dataset with various configurations.
        
        Args:
            output_dir: Directory to save the generated files
            
        Returns:
            Dictionary mapping dataset names to file paths
        """
        configs = [
            {
                "name": "young_patients",
                "config": {
                    "num_records": 10,
                    "age_min": 18,
                    "age_max": 30,
                    "state": "California"
                }
            },
            {
                "name": "elderly_patients",
                "config": {
                    "num_records": 10,
                    "age_min": 65,
                    "age_max": 90,
                    "state": "Florida"
                }
            },
            {
                "name": "female_patients",
                "config": {
                    "num_records": 10,
                    "gender": "F",
                    "state": "New York"
                }
            }
        ]
        
        results = {}
        for config in configs:
            data = self.generate_medical_data(**config["config"])
            filename = f"{config['name']}.json"
            file_path = self.save_generated_data(data, output_dir, filename)
            results[config["name"]] = file_path
            
        return results

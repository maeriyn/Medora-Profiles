import subprocess
import json
import os
import glob
from typing import Dict, Any, List
from app.core.base_generator import BaseGenerator, GeneratorConfig
from app.core.config import settings

class MedicalGeneratorConfig(GeneratorConfig):
    """Configuration specific to medical data generation"""
    state: str = "Massachusetts"
    gender: str = None
    age_min: int = None
    age_max: int = None
    modules: list[str] = None

class SyntheaGenerator(BaseGenerator):
    def __init__(self):
        self.synthea_path = os.path.join(os.path.dirname(__file__), 'synthea')
        if not os.path.exists(self.synthea_path):
            raise RuntimeError(f"Synthea not found at {self.synthea_path}")
        
    def generate(self, config: MedicalGeneratorConfig) -> Dict[str, Any]:
        """Generate medical data using Synthea"""
        # Determine the correct script to run based on OS
        if os.name == 'nt':  # Windows
            run_script = os.path.join(self.synthea_path, "run_synthea.bat")
        else:  # Unix-like
            run_script = os.path.join(self.synthea_path, "run_synthea")
            # Ensure the script is executable
            if os.path.exists(run_script):
                os.chmod(run_script, 0o755)
        
        cmd = [run_script]
        
        # Add basic configuration
        cmd.extend(["-p", str(config.num_records)])
        
        if config.seed:
            cmd.extend(["-s", str(config.seed)])
            
        # Add medical-specific configurations
        if config.state:
            cmd.extend(["--state", config.state])
        if config.gender:
            cmd.extend(["-g", config.gender])
        if config.age_min:
            cmd.extend(["--agemin", str(config.age_min)])
        if config.age_max:
            cmd.extend(["--agemax", str(config.age_max)])
        if config.modules:
            for module in config.modules:
                cmd.extend(["-m", module])
        
        # Force JSON output format
        cmd.extend(["--exporter.fhir.export", "true"])
        cmd.extend(["--exporter.json.export", "true"])
                
        # Run Synthea
        try:
            process = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=self.synthea_path,
                text=True,
                check=True
            )
            
            # Process and return the generated data
            output_dir = os.path.join(self.synthea_path, "output")
            return self._process_output(output_dir, config.output_format)
            
        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"Synthea generation failed: {e.stderr}")
        except Exception as e:
            raise RuntimeError(f"Failed to generate medical data: {str(e)}")
    
    def validate(self, data: Dict[str, Any]) -> bool:
        """Validate the generated medical data"""
        required_keys = ["patients", "encounters", "observations"]
        return all(key in data for key in required_keys) and \
               isinstance(data["patients"], list) and \
               isinstance(data["encounters"], list) and \
               isinstance(data["observations"], list)
    
    def get_schema(self) -> Dict[str, Any]:
        """Return the FHIR schema for medical data"""
        return {
            "type": "object",
            "properties": {
                "patients": {
                    "type": "array",
                    "items": {"$ref": "#/definitions/Patient"}
                },
                "encounters": {
                    "type": "array",
                    "items": {"$ref": "#/definitions/Encounter"}
                },
                "observations": {
                    "type": "array",
                    "items": {"$ref": "#/definitions/Observation"}
                }
            },
            "required": ["patients", "encounters", "observations"],
            "definitions": {
                "Patient": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "resourceType": {"type": "string", "enum": ["Patient"]},
                        "gender": {"type": "string", "enum": ["male", "female"]},
                        "birthDate": {"type": "string", "format": "date"}
                    }
                },
                "Encounter": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "resourceType": {"type": "string", "enum": ["Encounter"]},
                        "status": {"type": "string"},
                        "class": {"type": "object"},
                        "type": {"type": "array"}
                    }
                },
                "Observation": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "resourceType": {"type": "string", "enum": ["Observation"]},
                        "status": {"type": "string"},
                        "code": {"type": "object"},
                        "valueQuantity": {"type": "object"}
                    }
                }
            }
        }
    
    def _process_output(self, output_dir: str, format: str) -> Dict[str, Any]:
        """Process the Synthea output files"""
        if not os.path.exists(output_dir):
            raise RuntimeError(f"Output directory not found: {output_dir}")
            
        result = {
            "patients": [],
            "encounters": [],
            "observations": []
        }
        
        # Check both fhir and json directories
        fhir_dir = os.path.join(output_dir, "fhir")
        json_dir = os.path.join(output_dir, "json")
        
        directories_to_check = [d for d in [fhir_dir, json_dir] if os.path.exists(d)]
        if not directories_to_check:
            raise RuntimeError(f"No output files found in {output_dir}")
            
        # Process each JSON file in the output directories
        for directory in directories_to_check:
            for filepath in glob.glob(os.path.join(directory, "*.json")):
                try:
                    with open(filepath, 'r') as f:
                        data = json.load(f)
                        
                    # Handle both single resources and bundles
                    if isinstance(data, dict):
                        if "resourceType" in data:
                            self._add_resource_to_result(data, result)
                        elif "entry" in data:  # Handle FHIR bundles
                            for entry in data["entry"]:
                                if "resource" in entry:
                                    self._add_resource_to_result(entry["resource"], result)
                                
                except json.JSONDecodeError as e:
                    print(f"Warning: Failed to parse {filepath}: {e}")
                except Exception as e:
                    print(f"Warning: Error processing {filepath}: {e}")
                    
        return result
    
    def _add_resource_to_result(self, resource: Dict[str, Any], result: Dict[str, Any]) -> None:
        """Helper method to add a resource to the appropriate category in the result"""
        if "resourceType" in resource:
            resource_type = resource["resourceType"].lower() + "s"
            if resource_type in result:
                result[resource_type].append(resource)
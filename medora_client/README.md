# Medora Client

A Python client for interacting with Medora Systems' synthetic data generation API.

## Overview

Medora Systems specializes in creating multimodal datasets for training AI agents. This client provides an easy-to-use interface for generating cohesive, logically-connected synthetic datasets including medical records, tax forms, educational statistics, and more.

## Installation

### From PyPI

```bash
pip install medora-client
```

### From Source

```bash
git clone https://github.com/medora-systems/medora-client.git
cd medora-client
pip install -e .
```

## Quick Start

```python
from medora_client import MedoraClient

# Initialize the client (defaults to local server)
client = MedoraClient(base_url="http://localhost:8000")

# Generate synthetic medical data
data = client.generate_medical_data(
    num_records=5,
    age_min=40,
    age_max=60,
    state="California"
)

# Save the generated data
client.save_generated_data(data, output_dir="my_data", filename="medical_records.json")

# Generate a comprehensive demo dataset
demo_files = client.generate_demo_dataset()
print(f"Generated demo files: {demo_files}")
```

## Main Features

- Generate synthetic medical records with Synthea integration
- Customize data generation parameters (age, gender, geography, medical conditions)
- Save generated data in various formats (JSON, CSV, FHIR)
- Generate batch datasets with different configurations
- Check server status and available data modules

## API Reference

### Initialize Client

```python
client = MedoraClient(base_url="http://localhost:8000")
```

### Generate Medical Data

```python
data = client.generate_medical_data(
    num_records=10,             # Number of patient records
    seed=42,                    # Random seed for reproducibility
    state="Massachusetts",      # US state for demographics
    gender="F",                 # Filter by gender (M or F)
    age_min=20,                 # Minimum age
    age_max=40,                 # Maximum age
    modules=["hypertension"],   # Specific conditions
    export_format="json"        # Output format
)
```

### Save Generated Data

```python
file_path = client.save_generated_data(
    data,                        # Generated data
    output_dir="generated_data", # Output directory
    filename="medical_data.json" # Output filename
)
```

### List Available Modules

```python
modules = client.list_available_modules()
print(f"Available modules: {modules}")
```

### Generate Multiple Datasets

```python
configs = [
    {
        "num_records": 5,
        "age_min": 18,
        "age_max": 30
    },
    {
        "num_records": 5,
        "gender": "M",
        "modules": ["diabetes"]
    }
]
file_paths = client.generate_batch(configs)
```

### Check Server Status

```python
status = client.get_server_status()
print(f"Server status: {status}")
```

### Generate Demo Dataset

```python
demo_files = client.generate_demo_dataset(output_dir="demo_data")
```

## Advanced Usage

The client can be integrated into data pipelines, training workflows, or testing frameworks. For example:

```python
# Generate diverse test data with varied demographics
test_configs = []
for age in [(20, 40), (41, 65), (66, 90)]:
    for gender in ["M", "F"]:
        test_configs.append({
            "num_records": 5,
            "age_min": age[0],
            "age_max": age[1],
            "gender": gender
        })
        
test_files = client.generate_batch(test_configs, output_dir="test_data")
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

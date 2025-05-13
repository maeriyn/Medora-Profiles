#!/usr/bin/env python3
"""
Simple demo script showcasing the Medora client for synthetic data generation.
"""

import os
import argparse
from medora_client.client import MedoraClient

def main():
    parser = argparse.ArgumentParser(description="Demo of Medora synthetic data generation")
    parser.add_argument("--base-url", default="http://localhost:8000",
                        help="Base URL of the Medora API server (default: http://localhost:8000)")
    parser.add_argument("--output-dir", default="outputs",
                        help="Directory to save generated data (default: outputs)")
    args = parser.parse_args()
    
    # Create output directory if it doesn't exist
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), args.output_dir)
    os.makedirs(output_path, exist_ok=True)
    
    # Initialize the client
    print(f"Connecting to Medora API at {args.base_url}")
    client = MedoraClient(base_url=args.base_url)
    
    # Check if the server is running
    try:
        status = client.get_server_status()
        print(f"Server status: {status}")
    except Exception as e:
        print(f"Error connecting to server: {e}")
        print("Make sure the Medora API server is running and accessible.")
        return
    
    # List available modules
    try:
        modules = client.list_available_modules()
        print(f"Available modules: {modules}")
    except Exception as e:
        print(f"Error fetching modules: {e}")
    
    print("\n1. Generating a simple dataset")
    # Generate a basic dataset
    try:
        data = client.generate_medical_data(
            num_records=3,
            state="California",
            export_format="json"
        )
        file_path = client.save_generated_data(
            data, 
            output_dir=output_path, 
            filename="basic_dataset.json"
        )
        print(f"  ✓ Dataset saved to {file_path}")
    except Exception as e:
        print(f"  ✗ Error generating basic dataset: {e}")
    
    print("\n2. Generating dataset with age/gender filters")
    # Generate a dataset with age and gender filters
    try:
        data = client.generate_medical_data(
            num_records=3,
            age_min=65,
            age_max=85,
            gender="F",
            state="Florida",
            export_format="json"
        )
        file_path = client.save_generated_data(
            data, 
            output_dir=output_path, 
            filename="elderly_women.json"
        )
        print(f"  ✓ Dataset saved to {file_path}")
    except Exception as e:
        print(f"  ✗ Error generating filtered dataset: {e}")
    
    print("\n3. Generating multiple datasets in batch")
    # Generate multiple datasets using batch processing
    try:
        configs = [
            {
                "num_records": 2,
                "state": "New York",
                "gender": "M",
                "age_min": 25,
                "age_max": 40
            },
            {
                "num_records": 2,
                "state": "Texas",
                "gender": "F",
                "age_min": 45,
                "age_max": 60
            }
        ]
        file_paths = client.generate_batch(configs, output_dir=output_path)
        print(f"  ✓ Batch datasets saved to: {', '.join(file_paths)}")
    except Exception as e:
        print(f"  ✗ Error generating batch datasets: {e}")
    
    print("\n4. Generating predefined demo dataset")
    # Generate a predefined demo dataset
    try:
        demo_files = client.generate_demo_dataset(output_dir=os.path.join(output_path, "demo"))
        print(f"  ✓ Demo datasets generated:")
        for name, path in demo_files.items():
            print(f"    - {name}: {path}")
    except Exception as e:
        print(f"  ✗ Error generating demo dataset: {e}")
    
    print("\nDemo completed! Check the output directory for generated files.")

if __name__ == "__main__":
    main()

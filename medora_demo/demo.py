#!/usr/bin/env python3
"""
Simplified demo script showcasing the Medora client for generating highly detailed synthetic patient profiles.
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
        print(f"Trying to continue anyway, but results may be limited...")
        
    # Generate a highly detailed patient profile from Seattle
    print("\nGenerating highly detailed patient profile...")
    try:
        # Generate a single patient with comprehensive health history
        data = client.generate_medical_data(
            num_records=1,
            seed=42,  # Use fixed seed for reproducibility
            state="Washington",
            gender="F",  # Female patient
            age_min=55,
            age_max=65,  # Middle-aged to capture rich medical history
            modules=[
                "allergies",
                "medications", 
                "conditions",
                "procedures",
                "encounters",
                "immunizations",
                "observations",
                "imaging_studies"
            ],
            export_format="json"
        )
        
        # Save the data
        filename = "detailed_patient.json"
        file_path = client.save_generated_data(data, output_dir=output_path, filename=filename)
        print(f"✓ Generated highly detailed patient profile saved to: {file_path}")
        
    except Exception as e:
        print(f"✗ Error generating detailed patient profile: {e}")
        print("Attempting fallback with simplified options...")
        
        try:
            # Try with minimal options
            data = client.generate_medical_data(
                num_records=1,
                state="Washington",
                export_format="json"
            )
            
            # Save the data
            filename = "simplified_patient.json"
            file_path = client.save_generated_data(data, output_dir=output_path, filename=filename)
            print(f"✓ Generated simplified patient profile saved to: {file_path}")
        except Exception as e2:
            print(f"✗ Fallback also failed: {e2}")
    
    print("\nDemo completed! Check the output directory for generated files.")

if __name__ == "__main__":
    main()

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"  # Ensure this matches the API prefix in your FastAPI app

def test_patient_generation():
    # Basic configuration
    config = {
        "num_records": 2,
        "seed": 123,
        "state": "Massachusetts",
        "gender": "F",
        "age_min": 20,
        "age_max": 40,
        "export_format": "json"
    }
    
    response = requests.post(
        f"{BASE_URL}/generate/medical",
        json=config
    )
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("\nGenerated Data Summary:")
        print(f"Number of patients: {len(data['data']['patients'])}")
        print(f"Number of encounters: {len(data['data']['encounters'])}")
        print(f"Number of observations: {len(data['data']['observations'])}")
        
        # Save output to file for inspection
        with open("generated_data.json", "w") as f:
            json.dump(data, f, indent=2)
            
if __name__ == "__main__":
    test_patient_generation()
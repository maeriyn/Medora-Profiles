import requests

url = "http://127.0.0.1:8000/generate/medical"
payload = {
    "num_records": 5,
    "state": "Massachusetts",
    "gender": "F",
    "age_min": 20,
    "age_max": 40,
    "export_format": "json"
}

response = requests.post(url, json=payload)
print(f"Status Code: {response.status_code}")
print("Response:")
print(response.json())

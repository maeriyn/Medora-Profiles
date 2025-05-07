# Medora Systems Development Environment

Medora Systems specializes in creating multimodal datasets for training AI agents. We generate cohesive, logically-connected synthetic datasets including medical records, tax forms, educational statistics, and more for virtual personas. Our synthetic data maintains statistical accuracy when compared to real-world datasets while ensuring complete privacy and customizability.

## Quick Start with Docker

The easiest way to get started is using Docker. This setup includes everything you need, including Synthea:

```bash
# Clone the repository
git clone <your-repo-url>
cd <your-repo-name>

# Start the Docker environment
docker-compose -f .devcontainer/docker-compose.yml up -d

# The API will be available at:
# - FastAPI: http://localhost:8000
```

The Synthea medical data generator is automatically set up and built during container creation. Generated data will be persisted in a Docker volume.

## Tools

### Synthea Integration

[Synthea](https://github.com/synthetichealth/synthea) serves as one of our data generation tools, specifically for creating realistic medical records for our virtual personas. This open-source synthetic patient generator helps establish the medical history component of our multimodal datasets.

#### Using the API

To generate synthetic patient data, send a POST request to `/generate`:

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"num_patients": 10}'
```

The generated data will be available in the Docker volume and can be accessed at `/workspace/app/services/medical/synthea/output` inside the container.

### Configuration

You can customize the medical data generation by modifying the following parameters in your API request:
- `num_patients`: Number of patients to generate
- `population`: Population demographics (optional)
- `modules`: Specific conditions or modules to include (optional)

See the [Synthea wiki](https://github.com/synthetichealth/synthea/wiki) for detailed configuration options.

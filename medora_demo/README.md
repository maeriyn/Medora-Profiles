# Medora Demo

This folder contains a simple demonstration of the Medora client for generating synthetic medical data.

## Prerequisites

Before running the demo, ensure you have:

1. Python 3.7 or higher installed
2. The Medora API server running (by default at http://localhost:8000)
3. Installed the required packages

## Installation

1. Install the required packages:

```bash
pip install -r requirements.txt
```

## Running the Demo

1. Make sure the Medora API server is running
2. Run the demo script:

```bash
python demo.py
```

By default, the demo will:
- Connect to the API server at http://localhost:8000
- Generate multiple datasets with different configurations
- Save the generated data to the `./output` directory

## Optional Parameters

You can customize the demo with the following parameters:

```bash
python demo.py --base-url "http://your-server:port" --output-dir "/path/to/output"
```

- `--base-url`: Specify a different API server address (default: http://localhost:8000)
- `--output-dir`: Specify a different output directory (default: ./output)

## Generated Datasets

The demo will generate several datasets:

1. A basic dataset with default parameters
2. A dataset filtered by age and gender (elderly women)
3. Multiple datasets with different demographic characteristics 
4. A comprehensive predefined demo dataset

## Troubleshooting

If you encounter any issues:

1. Ensure the Medora API server is running and accessible
2. Check that you have installed all requirements
3. Verify you have the correct permissions to write to the output directory

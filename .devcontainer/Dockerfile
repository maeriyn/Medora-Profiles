FROM python:3.11-slim

# Install Java 11 and other dependencies
RUN apt-get update && \
    apt-get install -y default-jdk wget git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify Java installation
RUN java -version

# Set up working directory
WORKDIR /workspace

# Install pip requirements
COPY requirements.txt /workspace/requirements.txt
RUN pip install -r requirements.txt

# Clone and build Synthea
RUN mkdir -p app/services/medical && \
    cd app/services/medical && \
    git clone https://github.com/synthetichealth/synthea.git && \
    cd synthea && \
    ./gradlew build -x test

# Keep container running for development
CMD ["sleep", "infinity"]
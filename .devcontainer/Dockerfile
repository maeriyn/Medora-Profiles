FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    default-jdk \
    wget \
    git \
    curl \
    gnupg \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Verify installations
RUN java -version && \
    node --version && \
    npm --version

# Set up working directory
WORKDIR /workspace

# Install pip requirements
COPY requirements.txt /workspace/requirements.txt
RUN pip install -r requirements.txt

# Install frontend dependencies
WORKDIR /workspace/frontend
COPY frontend/package*.json ./
RUN npm install || echo "Frontend dependencies will be installed via volume mount"
WORKDIR /workspace

# Clone and build Synthea
RUN mkdir -p app/services/medical && \
    cd app/services/medical && \
    git clone https://github.com/synthetichealth/synthea.git && \
    cd synthea && \
    ./gradlew build -x test

# Keep container running for development
CMD ["sleep", "infinity"]
FROM python:3.10-slim AS build

# Install system-level dependencies for building PyAudio and others
RUN apt-get update && apt-get install -y \
    gcc \
    libportaudio2 \
    libportaudiocpp0 \
    portaudio19-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Stage 2: Final minimal image
FROM python:3.10-slim

# Copy installed packages from build stage
COPY --from=build /usr/local /usr/local

# Set working directory again
WORKDIR /app

# Copy the app code again (optional, if app files not changing in build)
COPY . .

# Set default command
CMD ["python", "app.py"] 
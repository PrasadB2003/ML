# Stage 1: Build Stage (Contains build tools and dependencies)
FROM python:3.10-slim AS build

# Install required system-level dependencies (necessary for building PyAudio and others)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libportaudio2 \
    libportaudiocpp0 \
    portaudio19-dev \
    ffmpeg \
    libsndfile1 \
    libasound-dev \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*  # Clean up APT cache to reduce image size

# Set working directory for the application
WORKDIR /app

# Copy only requirements to leverage Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application code (only what’s necessary for the app)
COPY . .

# Stage 2: Final Minimal Image (Production-Ready Image)
FROM python:3.10-slim

# Copy installed Python dependencies from the build stage to the final image
COPY --from=build /usr/local /usr/local

# Set working directory again
WORKDIR /app

# Copy only application code (no build tools, no unnecessary files)
COPY . .

# Expose Flask port
EXPOSE 5000

# Set the default command to run the app
CMD ["python", "app.py"]

# HTX Scribe

Audio transcription service built with React, Flask, and Whisper.

## Overview

HTX Scribe provides an intuitive web interface for uploading audio files and generating text transcriptions using Whisper's tiny model. The application supports multiple audio formats and includes search functionality for finding specific transcriptions.

## Prerequisites

- Docker and Docker Compose
- Git
- Web browser (Chrome, Firefox, Safari, or Edge)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/JshkT/htxScribe.git
cd htxScribe
```

2. Start the application:
```bash
docker compose up --build
```

3. Access the application:
- Frontend: http://localhost
- API Documentation: http://localhost:5000/api/docs

## Features

- Upload and transcribe audio files (WAV, MP3, M4A, OGG formats)
- View list of all transcriptions
- Search transcriptions by content or filename
- Full REST API with Swagger documentation

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── app.py        # Main Flask application
│   │   ├── db.py         # Database utilities
│   │   └── file_utils.py # File handling utilities
│   ├── tests/
│   └── Dockerfile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   └── App.js        # Main application component
│   └── Dockerfile
├── docs/                 # Project documentation
│   ├── architecture/
│   └── api/
└── docker-compose.yml
```

## API Endpoints

- `GET /api/health`: Health check endpoint
- `POST /api/transcribe`: Upload and transcribe audio files
- `GET /api/transcriptions`: Get all transcriptions
- `GET /api/search?q=<query>`: Search transcriptions

## Documentation

For more detailed information, see the [documentation](./docs/README.md):

- [System Architecture](./docs/architecture/system-architecture.md)
- [API Documentation](./docs/api/api-documentation.md)

## Technical Details

- Frontend: React with Material-UI
- Backend: Flask with Flask-RestX
- Transcription: OpenAI Whisper (tiny model)
- Storage: SQLite database
- Deployment: Docker containers with Nginx
# HTX Scribe System Architecture

## Overview

HTX Scribe is a full-stack application for audio transcription using OpenAI's Whisper model. The system follows a containerized microservice architecture with clear separation between frontend and backend components.

## Architecture Diagram

```mermaid
graph TB
    subgraph Client
        Browser[Web Browser]
    end

    subgraph Frontend
        React[React Application]
        UI[Material-UI Components]
        APIClient[API Client Service]
        Nginx[Nginx Proxy]
    end

    subgraph Backend
        Flask[Flask Server]
        RestX[Flask-RestX API Framework]
        Whisper[Whisper Model - tiny]
        SQLite[(SQLite Database)]
        Temp[Temp Storage]
    end

    subgraph Infrastructure
        Docker[Docker Containers]
        Volumes[Docker Volumes]
        Network[App Network]
    end

    Browser --> React
    React --> UI
    React --> APIClient
    APIClient --> Nginx
    Nginx -->|/api proxying| Flask
    Flask --> RestX
    RestX -->|/api/transcribe| Whisper
    RestX -->|db operations| SQLite
    RestX -->|file ops| Temp
    Docker --> |manages| Volumes
    Volumes -->|persistence| SQLite
    Volumes -->|temp files| Temp
    Network -->|connects| Frontend
    Network -->|connects| Backend
```

## Component Details

### Frontend Layer
- **React Application**: Single page application with Material-UI
- **API Client**: Centralized service for backend communication
- **Nginx**: Static file serving and API proxying

### Backend Layer
- **Flask Server**: RESTful API with Flask-RestX
- **Whisper Model**: Audio transcription using "tiny" variant
- **Storage**: SQLite database and temporary file storage

### Infrastructure
- **Docker Containers**: Frontend and backend services
- **Docker Volumes**: For data persistence 
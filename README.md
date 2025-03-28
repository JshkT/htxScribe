# HTX Scribe

Audio transcription service built with React, Flask, and Whisper.

## Prerequisites

- Docker and Docker Compose
- Anaconda or Miniconda
- Git
- Web browser (Chrome, Firefox, Safari, or Edge)

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd htxscribe
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost
- API Documentation: http://localhost:5000/api/swagger

## Development Setup

### Backend Development

1. Create a new Conda environment:
```bash
conda create -n htxscribe python=3.11
conda activate htxscribe
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Set environment variables:
```bash
# Linux/Mac
export FLASK_APP=app.app
export FLASK_ENV=development
export FLASK_DEBUG=1
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Windows (PowerShell)
$env:FLASK_APP="app.app"
$env:FLASK_ENV="development"
$env:FLASK_DEBUG=1
$env:PYTHONPATH="$env:PYTHONPATH;$(pwd)"
```

4. Run the Flask development server:
```bash
flask run --host=0.0.0.0 --port=5000
```

### Frontend Development

1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Set environment variables:
```bash
# Linux/Mac
export REACT_APP_API_URL=http://localhost:5000/api

# Windows (PowerShell)
$env:REACT_APP_API_URL="http://localhost:5000/api"
```

3. Start the development server:
```bash
npm start
```

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   └── app.py
│   ├── tests/
│   │   └── test_app.py
│   ├── environment.yml
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   └── (React application files)
└── README.md
```

## Backend Setup

### Prerequisites

- Anaconda or Miniconda
- Docker (optional, for containerized deployment)

### Local Development with Anaconda

1. Create and activate the conda environment:
```bash
cd backend
conda env create -f environment.yml
conda activate htx-transcription
```

2. Run the application:
```bash
python app/app.py
```

The backend will be available at `http://localhost:5000`

### Docker Deployment

1. Build the Docker image:
```bash
cd backend
docker build -t htx-transcription-backend .
```

2. Run the container:
```bash
docker run -p 5000:5000 htx-transcription-backend
```

### Running Tests

```bash
cd backend
conda activate htx-transcription
pytest tests/
```

## Frontend Setup

### Prerequisites

- Node.js 14 or higher
- npm or yarn

### Local Development

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /health`: Health check endpoint
- `POST /transcribe`: Upload and transcribe audio files
- `GET /transcriptions`: Get all transcriptions
- `GET /search?q=<query>`: Search transcriptions by filename

## Assumptions

1. Search via filename includes the extension
3. The Whisper model is loaded from Hugging Face
5. The frontend is served on port 3000 and backend on port 5000

## Model Notes

I tried several approaches with different Whisper model variants:

- **whisper-tiny**: 
  - Fast but less accurate for local context
  - Struggled with Singaporean terms like "yong tau foo"
  - Fine-tuning possible but I assume this is beyond the current scope

- **whisper-small**:
  - Better accuracy with Singaporean accents and terms
  - Successfully transcribed local food names
  - Slower inference time compared to tiny

- **whisper-small.en**:
  - Optimal balance of speed and accuracy
  - Retains performance on Singaporean English
  - Recommended model for this use case

The English-specific model (whisper-small.en) provides the best tradeoff between transcription quality and performance for our needs. However, I have implemented whisper-tiny as this was specifed in the technical test document.
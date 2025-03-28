# API Documentation

## Base URL

All API endpoints are accessible under the base URL `/api`.

## API Endpoints

### Health Check

Check if the API server is running.

```
GET /api/health
```

**Response Example:**
```json
{
  "status": "ok",
  "message": "API server is running"
}
```

**Status Codes:**
- `200`: Server is operational

### Upload and Transcribe

Upload an audio file and generate a transcription.

```
POST /api/transcribe
```

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: Audio file (Required)
    - Supported formats: `.wav`, `.mp3`, `.m4a`, `.ogg`
    - Maximum size: 16MB

**Response Example:**
```json
{
  "id": 42,
  "filename": "meeting_notes.mp3",
  "transcription": "This is the transcribed text from the audio file...",
  "timestamp": "2023-06-15T14:30:45.123Z"
}
```

**Status Codes:**
- `200`: Successful transcription
- `400`: Invalid request (file too large, unsupported format)
- `500`: Server error during processing

**Curl Example:**
```bash
curl -X POST \
  -F "file=@/path/to/audio.mp3" \
  http://localhost/api/transcribe
```

### List All Transcriptions

Retrieve a list of all transcriptions.

```
GET /api/transcriptions
```

**Response Example:**
```json
{
  "transcriptions": [
    {
      "id": 42,
      "filename": "meeting_notes.mp3",
      "transcription": "This is the transcribed text from the audio file...",
      "timestamp": "2023-06-15T14:30:45.123Z"
    },
    {
      "id": 43,
      "filename": "interview.wav",
      "transcription": "Another transcribed text...",
      "timestamp": "2023-06-16T09:12:33.456Z"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

**Curl Example:**
```bash
curl http://localhost/api/transcriptions
```

### Search Transcriptions

Search for transcriptions containing specific text in either filename or transcription content.

```
GET /api/search?q={search_term}
```

**Parameters:**
- `q`: Search term (Required)

**Response Example:**
```json
{
  "results": [
    {
      "id": 42,
      "filename": "meeting_notes.mp3",
      "transcription": "This is the transcribed text from the audio file...",
      "timestamp": "2023-06-15T14:30:45.123Z"
    }
  ]
}
```

**Status Codes:**
- `200`: Success (even if no results found)
- `400`: Missing query parameter
- `500`: Server error

**Curl Example:**
```bash
curl http://localhost/api/search?q=meeting
```

## Error Responses

All API endpoints return error responses in a consistent format:

```json
{
  "error": true,
  "message": "Description of the error"
}
```

## Rate Limiting

The API currently does not implement rate limiting, but excessive requests may impact performance due to resource limitations, especially during transcription operations.

## Authentication

The API currently does not require authentication.

## CORS

Cross-Origin Resource Sharing is enabled for all origins, allowing the API to be accessed from any domain.

## Swagger Documentation

A Swagger UI interface is available for testing and exploring all endpoints:

```
GET /api/docs
```

This interactive documentation provides a way to test endpoints directly from the browser. 
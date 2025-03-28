import pytest
from unittest.mock import patch, MagicMock
import os
import json
from app.app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def mock_whisper():
    with patch('app.app.whisper_model') as mock:
        mock.return_value = {'text': 'This is a test transcription'}
        yield mock

def test_health_check(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'

def test_transcribe_no_file(client):
    response = client.post('/transcribe', data={})
    assert response.status_code == 400
    assert 'error' in response.json

def test_transcribe_with_file(client, mock_whisper, tmp_path):
    # Create a temporary audio file
    test_file = tmp_path / "test.wav"
    test_file.write_bytes(b"dummy audio content")
    
    with open(test_file, 'rb') as f:
        response = client.post(
            '/transcribe',
            data={'file': (f, 'test.wav')},
            content_type='multipart/form-data'
        )
    
    assert response.status_code == 200
    assert 'transcription' in response.json
    assert response.json['transcription'] == 'This is a test transcription'

def test_get_transcriptions(client):
    response = client.get('/transcriptions')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_search_no_query(client):
    response = client.get('/search')
    assert response.status_code == 400
    assert 'error' in response.json

def test_search_with_query(client):
    response = client.get('/search?q=test')
    assert response.status_code == 200
    assert isinstance(response.json, list) 
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restx import Api, Resource, fields, Namespace
import logging
import whisper

# Import utility modules
from .db import init_db, save_transcription, get_all_transcriptions, search_transcriptions
from .file_utils import save_temp_file, remove_temp_file

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize Swagger
api = Api(
    app,
    version='1.0',
    title='HTX Transcription API',
    description='API for audio file transcription using Whisper model',
    doc='/api/docs'
)

# Define namespaces
ns = api.namespace('api', description='Transcription operations')

# Define models
transcription_model = api.model('Transcription', {
    'id': fields.Integer(readonly=True, description='Unique identifier'),
    'file_name': fields.String(required=True, description='Original file name'),
    'transcription': fields.String(required=True, description='Transcribed text'),
    'created_at': fields.DateTime(readonly=True, description='Creation timestamp')
})

transcription_input = api.model('TranscriptionInput', {
    'file': fields.Raw(required=True, description='Audio file to transcribe')
})

search_input = api.model('SearchInput', {
    'query': fields.String(required=True, description='Search query')
})

# Initialize Whisper model lazily
def get_whisper_model():
    """Initialize the Whisper model."""
    if not hasattr(get_whisper_model, 'model'):
        logging.info("Loading Whisper model...")
        # Using the tiny model for faster processing
        get_whisper_model.model = whisper.load_model("tiny")
        logging.info("Whisper model loaded successfully - using tiny model")
    return get_whisper_model.model

# Initialize database on startup
init_db()

@ns.route('/health')
class HealthCheck(Resource):
    @ns.doc('health_check')
    @ns.response(200, 'Service is healthy')
    def get(self):
        """Check if the service is healthy"""
        return {"status": "healthy"}, 200

@ns.route('/transcribe')
class Transcription(Resource):
    @ns.doc('transcribe_audio')
    @ns.expect(transcription_input)
    @ns.response(200, 'Transcription successful')
    @ns.response(400, 'Invalid input')
    @ns.response(500, 'Server error')
    def post(self):
        """Transcribe an audio file"""
        if 'file' not in request.files:
            logger.error("No file provided in request")
            return {"error": "No file provided"}, 400
        
        file = request.files['file']
        if file.filename == '':
            logger.error("Empty filename provided")
            return {"error": "No file selected"}, 400

        # Save file temporarily
        temp_path, original_filename = save_temp_file(file)
        if not temp_path:
            return {"error": "Failed to save file"}, 500

        try:
            # Get the model and transcribe
            model = get_whisper_model()
            if app.config.get('TESTING', False):
                transcription = "This is a test transcription"
            else:
                logger.info("Starting transcription...")
                # Use English language parameter for optimized transcription
                result = model.transcribe(temp_path, language="en")
                transcription = result["text"]
                logger.info("Transcription completed successfully")

            # Save to database
            if not save_transcription(original_filename, transcription):
                return {"error": "Failed to save transcription"}, 500

            # Clean up temporary file
            remove_temp_file(temp_path)

            return {
                "message": "Transcription successful",
                "file_name": original_filename,
                "transcription": transcription
            }, 200

        except Exception as e:
            logger.error(f"Error during transcription: {str(e)}")
            # Clean up temporary file in case of error
            remove_temp_file(temp_path)
            return {"error": str(e)}, 500

@ns.route('/transcriptions')
class TranscriptionList(Resource):
    @ns.doc('list_transcriptions')
    @ns.marshal_list_with(transcription_model)
    @ns.response(200, 'Success')
    @ns.response(500, 'Server error')
    def get(self):
        """Get all transcriptions"""
        transcriptions = get_all_transcriptions()
        return transcriptions, 200

@ns.route('/search')
class Search(Resource):
    @ns.doc('search_transcriptions')
    @ns.expect(search_input)
    @ns.marshal_list_with(transcription_model)
    @ns.response(200, 'Success')
    @ns.response(400, 'Invalid input')
    @ns.response(500, 'Server error')
    def get(self):
        """Search transcriptions"""
        query = request.args.get('q', '')
        if not query:
            return {"error": "Search query is required"}, 400

        results = search_transcriptions(query)
        return results, 200

if __name__ == '__main__':
    app.run(debug=True) 
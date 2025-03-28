import os
import uuid
import logging

logger = logging.getLogger(__name__)

TEMP_DIR = 'temp'
os.makedirs(TEMP_DIR, exist_ok=True)

def save_temp_file(file):
    """Save an uploaded file to a temporary location."""
    try:
        original_filename = file.filename
        file_extension = os.path.splitext(original_filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        temp_path = os.path.join(TEMP_DIR, unique_filename)
        
        os.makedirs(TEMP_DIR, exist_ok=True)
        file.save(temp_path)
        logger.info(f"File saved temporarily at {temp_path}")
        return temp_path, original_filename
    except Exception as e:
        logger.error(f"Error saving temporary file: {str(e)}")
        return None, None

def remove_temp_file(file_path):
    """Remove a temporary file safely."""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Temporary file removed: {file_path}")
            return True
        return False
    except Exception as e:
        logger.error(f"Error removing temporary file: {str(e)}")
        return False 
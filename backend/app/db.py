import sqlite3
import logging
import os
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

DB_PATH = 'transcriptions.db'

def get_db_connection():
    """Get a database connection with proper error handling."""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row  # This enables column access by name
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise

def init_db():
    """Initialize the database tables."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transcriptions
            (id INTEGER PRIMARY KEY AUTOINCREMENT,
             file_name TEXT NOT NULL,
             transcription TEXT NOT NULL,
             created_at TIMESTAMP NOT NULL)
        ''')
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

def format_date_iso8601(date_str):
    """Convert a datetime string to ISO 8601 format with timezone."""
    if not date_str:
        return date_str
    try:
        # If it's already a datetime object
        if isinstance(date_str, datetime):
            # Ensure datetime has timezone info (use UTC if none)
            if date_str.tzinfo is None:
                date_str = date_str.replace(tzinfo=timezone.utc)
            return date_str.isoformat()
        
        # If it's a string, try to parse it
        date_str_clean = str(date_str).replace(' ', 'T')
        if 'Z' not in date_str_clean and '+' not in date_str_clean and '-' not in date_str_clean[10:]:
            # No timezone info, assume UTC
            date_str_clean += 'Z'
        
        dt = datetime.fromisoformat(date_str_clean.replace('Z', '+00:00'))
        return dt.isoformat()
    except Exception as e:
        logger.warning(f"Could not format date {date_str}: {str(e)}")
        # As a fallback, return a properly formatted current UTC time
        return datetime.now(timezone.utc).isoformat()

def save_transcription(file_name, transcription):
    """Save a transcription to the database."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Store dates in ISO 8601 format with UTC timezone
        created_at = datetime.now(timezone.utc).isoformat()
        cursor.execute('''
            INSERT INTO transcriptions (file_name, transcription, created_at)
            VALUES (?, ?, ?)
        ''', (file_name, transcription, created_at))
        conn.commit()
        conn.close()
        logger.info(f"Transcription saved: {file_name}")
        return True
    except Exception as e:
        logger.error(f"Error saving transcription: {str(e)}")
        return False

def get_all_transcriptions():
    """Get all transcriptions from the database."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM transcriptions ORDER BY created_at DESC')
        transcriptions = [{
            'id': row['id'],
            'file_name': row['file_name'],
            'transcription': row['transcription'],
            'created_at': format_date_iso8601(row['created_at'])
        } for row in cursor.fetchall()]
        conn.close()
        return transcriptions
    except Exception as e:
        logger.error(f"Error fetching transcriptions: {str(e)}")
        return []

def search_transcriptions(query):
    """Search transcriptions by text or filename."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM transcriptions 
            WHERE file_name LIKE ? OR transcription LIKE ?
            ORDER BY created_at DESC
        ''', (f'%{query}%', f'%{query}%'))
        results = [{
            'id': row['id'],
            'file_name': row['file_name'],
            'transcription': row['transcription'],
            'created_at': format_date_iso8601(row['created_at'])
        } for row in cursor.fetchall()]
        conn.close()
        return results
    except Exception as e:
        logger.error(f"Error searching transcriptions: {str(e)}")
        return [] 
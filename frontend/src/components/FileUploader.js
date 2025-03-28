import React from 'react';
import { Paper, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg']
    }
  });

  return (
    <Paper 
      {...getRootProps()} 
      sx={{ 
        p: 3, 
        mb: 3, 
        textAlign: 'center',
        backgroundColor: isDragActive ? '#f0f0f0' : 'white',
        cursor: 'pointer'
      }}
    >
      <input {...getInputProps()} data-testid="file-input" />
      {isDragActive ? (
        <Typography>Drop the audio files here ...</Typography>
      ) : (
        <Typography>
          Drag and drop audio files here, or click to select files
        </Typography>
      )}
    </Paper>
  );
};

export default FileUploader; 
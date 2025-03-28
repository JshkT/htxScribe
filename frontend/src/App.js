import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import FileUploader from './components/FileUploader';
import SearchBar from './components/SearchBar';
import TranscriptionList from './components/TranscriptionList';
import { transcriptionApi } from './services/api';

function App() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTranscriptions = async () => {
    setLoading(true);
    const { data, error } = await transcriptionApi.getAll();
    setTranscriptions(data);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  const handleFileDrop = async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    
    setLoading(true);
    setError(null);
    
    const { error } = await transcriptionApi.upload(acceptedFiles[0]);
    
    if (error) {
      setError(error);
    } else {
      await fetchTranscriptions();
    }
    
    setLoading(false);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    setLoading(true);
    const { data, error } = await transcriptionApi.search(query);
    setTranscriptions(data);
    setError(error);
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Audio Transcription Service
        </Typography>

        <FileUploader onDrop={handleFileDrop} />
        <SearchBar value={searchQuery} onChange={handleSearch} />
        <TranscriptionList 
          transcriptions={transcriptions} 
          loading={loading} 
          error={error} 
        />
      </Box>
    </Container>
  );
}

export default App; 
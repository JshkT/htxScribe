import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material';

// Helper function to format date with timezone
const formatDateTime = (isoString) => {
  try {
    const date = new Date(isoString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    
    // Format using browser's locale and timezone settings
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Date error";
  }
};

const TranscriptionList = ({ transcriptions, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }} data-testid="loading">
        <CircularProgress data-testid="skeleton" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mb: 2 }}>
        {error}
      </Typography>
    );
  }

  if (!transcriptions.length) {
    return (
      <Typography sx={{ textAlign: 'center', my: 4 }}>
        No transcriptions found
      </Typography>
    );
  }

  return (
    <List>
      {transcriptions.map((item) => (
        <ListItem key={item.id} divider>
          <ListItemText
            primary={item.file_name}
            secondary={
              <>
                <Typography component="span" variant="body2">
                  {item.transcription}
                </Typography>
                <br />
                <Typography component="span" variant="caption" color="textSecondary">
                  {formatDateTime(item.created_at)}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TranscriptionList; 
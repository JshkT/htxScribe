import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders main heading', () => {
    render(<App />);
    expect(screen.getByText(/Audio Transcription Service/i)).toBeInTheDocument();
  });

  test('renders file upload area', () => {
    render(<App />);
    expect(screen.getByText(/Drag and drop audio files here/i)).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(<App />);
    expect(screen.getByLabelText(/search transcriptions/i)).toBeInTheDocument();
  });

  test('loads transcriptions on mount', async () => {
    const mockTranscriptions = [
      {
        id: 1,
        file_name: 'test.wav',
        transcription: 'Test transcription',
        created_at: '2024-03-19T12:00:00'
      }
    ];

    axios.get.mockResolvedValueOnce({ data: mockTranscriptions });

    render(<App />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/transcriptions');
    });

    expect(await screen.findByText('test.wav')).toBeInTheDocument();
    expect(await screen.findByText('Test transcription')).toBeInTheDocument();
  });

  test('handles file upload', async () => {
    const file = new File(['dummy audio'], 'test.wav', { type: 'audio/wav' });
    const mockResponse = {
      data: {
        message: 'Transcription successful',
        file_name: 'test.wav',
        transcription: 'Test transcription'
      }
    };

    axios.post.mockResolvedValueOnce(mockResponse);
    axios.get.mockResolvedValueOnce({ data: [] }); // For initial load
    
    render(<App />);

    const input = screen.getByTestId('file-input');
    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  test('handles search', async () => {
    const mockSearchResults = [
      {
        id: 1,
        file_name: 'search-test.wav',
        transcription: 'Search test transcription',
        created_at: '2024-03-19T12:00:00'
      }
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('/search')) {
        return Promise.resolve({ data: mockSearchResults });
      }
      return Promise.resolve({ data: [] });
    });

    render(<App />);

    const searchInput = screen.getByLabelText(/search transcriptions/i);
    await userEvent.type(searchInput, 'test');

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/search?q=test');
    });

    expect(await screen.findByText('search-test.wav')).toBeInTheDocument();
  });

  test('displays error message on failed transcription', async () => {
    const file = new File(['dummy audio'], 'test.wav', { type: 'audio/wav' });
    
    axios.post.mockRejectedValueOnce({ 
      response: { data: { error: 'Transcription failed' } }
    });
    axios.get.mockResolvedValueOnce({ data: [] }); // For initial load

    render(<App />);

    const input = screen.getByTestId('file-input');
    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/Transcription failed/i)).toBeInTheDocument();
    });
  });
}); 
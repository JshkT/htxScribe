import { render, screen } from '@testing-library/react';
import TranscriptionList from './TranscriptionList';

describe('TranscriptionList Component', () => {
  const mockTranscriptions = [
    {
      id: 1,
      file_name: 'test1.wav',
      transcription: 'Test transcription 1',
      created_at: '2024-03-19T12:00:00'
    },
    {
      id: 2,
      file_name: 'test2.wav',
      transcription: 'Test transcription 2',
      created_at: '2024-03-19T13:00:00'
    }
  ];

  test('renders empty state when no transcriptions', () => {
    render(<TranscriptionList transcriptions={[]} />);
    expect(screen.getByText(/No transcriptions found/i)).toBeInTheDocument();
  });

  test('renders list of transcriptions', () => {
    render(<TranscriptionList transcriptions={mockTranscriptions} />);
    
    expect(screen.getByText('test1.wav')).toBeInTheDocument();
    expect(screen.getByText('Test transcription 1')).toBeInTheDocument();
    expect(screen.getByText('test2.wav')).toBeInTheDocument();
    expect(screen.getByText('Test transcription 2')).toBeInTheDocument();
  });

  test('displays formatted dates', () => {
    render(<TranscriptionList transcriptions={mockTranscriptions} />);
    
    const date = new Date('2024-03-19T12:00:00').toLocaleString();
    expect(screen.getByText(date)).toBeInTheDocument();
  });

  test('renders loading skeleton when loading', () => {
    render(<TranscriptionList transcriptions={[]} isLoading={true} />);
    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  test('displays error message when provided', () => {
    const errorMessage = 'Failed to load transcriptions';
    render(<TranscriptionList transcriptions={[]} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('handles long transcriptions', () => {
    const longTranscription = {
      id: 1,
      file_name: 'long.wav',
      transcription: 'A'.repeat(300), // Create a long string
      created_at: '2024-03-19T12:00:00'
    };

    render(<TranscriptionList transcriptions={[longTranscription]} />);
    const transcriptionElement = screen.getByText(/A+/);
    expect(transcriptionElement).toBeInTheDocument();
    expect(transcriptionElement.textContent.length).toBeLessThan(300); // Should be truncated
  });
}); 
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from './FileUpload';

describe('FileUpload Component', () => {
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dropzone area', () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    expect(screen.getByText(/Drag and drop audio files here/i)).toBeInTheDocument();
  });

  test('handles file drop', async () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    
    const file = new File(['dummy audio'], 'test.wav', { type: 'audio/wav' });
    const dropzone = screen.getByTestId('dropzone');

    await userEvent.upload(dropzone, file);

    expect(mockOnUpload).toHaveBeenCalledWith(expect.any(File));
  });

  test('shows error for invalid file type', async () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    
    const file = new File(['dummy text'], 'test.txt', { type: 'text/plain' });
    const dropzone = screen.getByTestId('dropzone');

    await userEvent.upload(dropzone, file);

    expect(screen.getByText(/Only audio files are allowed/i)).toBeInTheDocument();
    expect(mockOnUpload).not.toHaveBeenCalled();
  });

  test('handles multiple file upload', async () => {
    render(<FileUpload onUpload={mockOnUpload} />);
    
    const files = [
      new File(['audio1'], 'test1.wav', { type: 'audio/wav' }),
      new File(['audio2'], 'test2.wav', { type: 'audio/wav' })
    ];
    const dropzone = screen.getByTestId('dropzone');

    await userEvent.upload(dropzone, files);

    expect(mockOnUpload).toHaveBeenCalledTimes(2);
  });

  test('shows loading state during upload', () => {
    render(<FileUpload onUpload={mockOnUpload} isLoading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('shows error message when provided', () => {
    const errorMessage = 'Upload failed';
    render(<FileUpload onUpload={mockOnUpload} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
}); 
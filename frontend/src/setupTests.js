// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock the window.URL.createObjectURL method
window.URL.createObjectURL = jest.fn();

// Mock the window.URL.revokeObjectURL method
window.URL.revokeObjectURL = jest.fn(); 
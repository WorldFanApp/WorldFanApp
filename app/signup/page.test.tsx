import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupPage from './page'; // Adjust path as necessary
import { ISuccessResult, IDKitWidget } from '@worldcoin/idkit'; // For mock function signature and types

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    // Add other router methods if used by the component
  }),
}));

// Ensure we get the actual module for jest.requireActual, then mock specific parts.
jest.unmock('@worldcoin/idkit'); 
jest.mock('@worldcoin/idkit', () => {
  const originalModule = jest.requireActual('@worldcoin/idkit');
  return {
    ...originalModule, // Keep all original exports
    IDKitWidget: jest.fn((props: any) => {
      // Simplified mock: renders a button that calls handleVerify
      // The children prop (which is a function rendering the actual button in the component)
      // is called here to render that button.
      // We also add our own button to trigger the verification for the test.
      return (
        <div data-testid="idkit-widget-mock-container">
          {/* Render the actual button from the component's children prop */}
          {props.children({ open: jest.fn() })}
          {/* Test button to trigger handleVerify */}
          <button
            data-testid="mock-idkit-verify-trigger"
            onClick={() => {
              if (props.handleVerify) {
                const mockProof: ISuccessResult = {
                  merkle_root: 'mock_merkle_root',
                  nullifier_hash: 'mock_nullifier_hash',
                  proof: 'mock_proof',
                  credential_type: 'orb',
                };
                props.handleVerify(mockProof);
              }
            }}
          >
            Test Verify
          </button>
        </div>
      );
    }),
  };
});


global.fetch = jest.fn();

describe('SignupPage - World ID Verification', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (fetch as jest.Mock).mockClear();
    (IDKitWidget as jest.Mock).mockClear();

    // Set default successful mock for fetch, can be overridden in specific tests
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, nullifier_hash: 'mock_nullifier_default' }),
    });
  });

  test('initial state: shows IDKitWidget and hides multi-step form', () => {
    render(<SignupPage />);
    // Check for IDKitWidget (or its button rendered by our mock)
    // The text "Verify with World ID" is inside the button rendered by `props.children`
    expect(screen.getByText('Verify with World ID')).toBeInTheDocument(); 
    expect(screen.getByTestId('idkit-widget-mock-container')).toBeInTheDocument();

    // Check that the multi-step form title (e.g., Location) is not visible
    expect(screen.queryByText('Location')).not.toBeInTheDocument();
    expect(screen.queryByText('Tell us where you\'re from')).not.toBeInTheDocument();
  });

  test('successful verification flow: hides IDKitWidget, shows form, no error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, nullifier_hash: 'mock_nullifier_success' }),
    });

    render(<SignupPage />);

    // Simulate the IDKitWidget's handleVerify prop being called
    // This is done by clicking the test trigger button inside our simplified mock IDKitWidget
    fireEvent.click(screen.getByTestId('mock-idkit-verify-trigger'));
    
    await waitFor(() => {
      // Check that fetch was called correctly by handleVerifyProof
      expect(fetch).toHaveBeenCalledWith('/api/verify-world-id', expect.anything());
    });

    await waitFor(() => {
      // IDKitWidget mock container should be gone
      expect(screen.queryByTestId('idkit-widget-mock-container')).not.toBeInTheDocument();
      expect(screen.queryByText('Verify with World ID')).not.toBeInTheDocument(); // The original button
      
      // Multi-step form should be visible (e.g., by checking for its first step's title)
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText("Tell us where you're from")).toBeInTheDocument();
      
      // No error message should be displayed
      expect(screen.queryByRole('alert')).not.toBeInTheDocument(); // Assuming errors are shown in an alert role
      expect(screen.queryByText(/Verification failed/i)).not.toBeInTheDocument();
    });
  });

  test('failed verification flow: IDKitWidget persists, form hidden, error shown', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error")); // Simulate network error
    // OR: mock a non-ok response:
    // (fetch as jest.Mock).mockResolvedValueOnce({
    //   ok: false,
    //   status: 400,
    //   json: async () => ({ success: false, error: 'Verification failed from server', detail: 'Invalid proof' }),
    // });

    render(<SignupPage />);

    // Simulate the IDKitWidget's handleVerify prop being called
    fireEvent.click(screen.getByTestId('mock-idkit-verify-trigger'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/verify-world-id', expect.anything());
    });

    await waitFor(() => {
      // IDKitWidget mock should still be visible
      expect(screen.getByTestId('idkit-widget-mock-container')).toBeInTheDocument();
      // The original button text should also be there
      expect(screen.getByText('Verify with World ID')).toBeInTheDocument(); 


      // Multi-step form should remain hidden
      expect(screen.queryByText('Location')).not.toBeInTheDocument();
      
      // Error message should be displayed
      // The error message comes from the catch block in handleVerifyProof
      expect(screen.getByText('An error occurred during verification. Please try again.')).toBeInTheDocument();
    });
  });

  test('failed verification flow (server error response): shows error message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ success: false, error: 'Invalid proof details', detail: 'The proof provided is malformed.' }),
    });
  
    render(<SignupPage />);
  
    fireEvent.click(screen.getByTestId('mock-idkit-verify-trigger'));
  
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/verify-world-id', expect.anything());
    });
  
    await waitFor(() => {
      expect(screen.getByTestId('idkit-widget-mock-container')).toBeInTheDocument();
      expect(screen.queryByText('Location')).not.toBeInTheDocument();
      // Check for the specific error message from the server
      expect(screen.getByText('Invalid proof details')).toBeInTheDocument();
    });
  });

});

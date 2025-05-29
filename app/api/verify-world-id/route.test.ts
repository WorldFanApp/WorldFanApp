import 'whatwg-fetch'; // Polyfill for fetch, Request, Response, Headers
import { POST } from './route'; 
import { NextRequest } from 'next/server';

// Mock next/server to control NextResponse.json
const mockJson = jest.fn();
jest.mock('next/server', () => ({
  NextResponse: {
    json: (...args: any[]) => {
      // Allow tests to inspect what NextResponse.json was called with
      mockJson(...args); 
      // Return a simplified Response-like object for the test assertions on status
      // The actual content check will be done via mockJson.mock.calls
      const body = args[0];
      const options = args[1] || { status: 200 };
      return {
        status: options.status,
        json: async () => body, // Make it awaitable like a real Response
        text: async () => JSON.stringify(body), // For convenience
        headers: new Headers(options.headers),
      };
    },
  },
}));

// Mock @worldcoin/idkit to use our manual mock for verifyCloudProof
jest.mock('@worldcoin/idkit', () => {
  // Require the manual mock *inside* the factory to avoid hoisting issues
  const manualMock = require('../../../test-utils/manual-mocks/worldcoin-idkit');
  return {
    ...jest.requireActual('@worldcoin/idkit'), // Get actual module parts
    verifyCloudProof: manualMock.verifyCloudProof, // Override verifyCloudProof
  };
});
// This ensures that when the route.ts imports verifyCloudProof from '@worldcoin/idkit', it gets our manual mock.
// We also need to import it in the test file to perform assertions on it.
import { verifyCloudProof } from '@worldcoin/idkit'; // This will be the mocked version.


// Helper function to create a mock NextRequest
function createMockRequest(body: any, headers?: HeadersInit): NextRequest {
  const request = new Request('http://localhost/api/verify-world-id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return request as NextRequest;
}

describe('API Route: /api/verify-world-id', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear cache
    process.env = {
      ...originalEnv,
      WLD_APP_ID: 'test_app_id',
      WLD_ACTION_ID: 'test_action_id',
    };
    (verifyCloudProof as jest.Mock).mockClear(); // verifyCloudProof is manuallyMockedVerifyCloudProof
    mockJson.mockClear(); // Clear our NextResponse.json mock
  });

  afterEach(() => {
    process.env = originalEnv; // Restore original env
  });

  test('successful verification: returns 200 with success true', async () => {
    const mockProofResponse = {
      success: true,
      nullifier_hash: 'mock_nullifier',
    };
    (verifyCloudProof as jest.Mock).mockResolvedValue(mockProofResponse);

    const mockRequestBody = {
      proof: '0x123',
      signal: 'test_signal',
      merkle_root: '0x456',
      nullifier_hash: '0x789',
      credential_type: 'orb',
    };

    const request = createMockRequest(mockRequestBody);
    await POST(request); // NextResponse.json is mocked, so we check mockJson

    expect(mockJson).toHaveBeenCalledWith(mockProofResponse, { status: 200 });
    expect(verifyCloudProof).toHaveBeenCalledWith(
      mockRequestBody.proof,
      'test_app_id',
      'test_action_id', // from process.env
      mockRequestBody.signal
    );
  });

  test('failed verification (from World ID): returns 400 with error details', async () => {
    const mockFailureResponse = {
      success: false,
      code: 'already_redeemed',
      detail: 'This nullifier has already been redeemed for this action.',
      // other fields
    };
    (verifyCloudProof as jest.Mock).mockResolvedValue(mockFailureResponse);

    const mockRequestBody = {
      proof: '0xfailed_proof',
      signal: 'test_signal_fail',
      merkle_root: '0xfailed_merkle',
      nullifier_hash: '0xfailed_nullifier',
      credential_type: 'orb',
    };

    const request = createMockRequest(mockRequestBody);
    await POST(request);

    expect(mockJson).toHaveBeenCalledWith(
      {
        error: 'Verification failed',
        code: mockFailureResponse.code,
        detail: mockFailureResponse.detail,
      },
      { status: 400 }
    );
    expect(verifyCloudProof).toHaveBeenCalledWith(
      mockRequestBody.proof,
        'test_app_id',
        'test_action_id',
        mockRequestBody.signal
    );
  });

  test('invalid request (missing proof): returns 400 with error', async () => {
    const mockRequestBody = {
      // proof is missing
      signal: 'test_signal_no_proof',
      merkle_root: '0xmerkle',
      nullifier_hash: '0xnullifier',
      credential_type: 'orb',
    };

    const request = createMockRequest(mockRequestBody);
    await POST(request);

    expect(mockJson).toHaveBeenCalledWith({ error: 'Missing proof or signal' }, { status: 400 });
    expect(verifyCloudProof).not.toHaveBeenCalled();
  });

  test('invalid request (missing signal): returns 400 with error', async () => {
    const mockRequestBody = {
      proof: '0xsome_proof',
      // signal is missing
      merkle_root: '0xmerkle',
      nullifier_hash: '0xnullifier',
      credential_type: 'orb',
    };

    const request = createMockRequest(mockRequestBody);
    await POST(request);

    expect(mockJson).toHaveBeenCalledWith({ error: 'Missing proof or signal' }, { status: 400 });
    expect(verifyCloudProof).not.toHaveBeenCalled();
  });
  
  test('server configuration error (missing WLD_APP_ID): returns 500', async () => {
    delete process.env.WLD_APP_ID; // Remove WLD_APP_ID for this test

    const mockRequestBody = {
      proof: '0x123',
      signal: 'test_signal',
      merkle_root: '0x456',
      nullifier_hash: '0x789',
      credential_type: 'orb',
    };

    const request = createMockRequest(mockRequestBody);
    await POST(request);

    expect(mockJson).toHaveBeenCalledWith({ error: 'Server configuration error' }, { status: 500 });
    expect(verifyCloudProof).not.toHaveBeenCalled();
  });

  test('server configuration error (missing WLD_ACTION_ID): returns 500', async () => {
    delete process.env.WLD_ACTION_ID; // Remove WLD_ACTION_ID for this test

    const mockRequestBody = {
      proof: '0x123',
      signal: 'test_signal',
      merkle_root: '0x456',
      nullifier_hash: '0x789',
      credential_type: 'orb',
    };

    const request = createMockRequest(mockRequestBody);
    await POST(request);

    expect(mockJson).toHaveBeenCalledWith({ error: 'Server configuration error' }, { status: 500 });
    expect(verifyCloudProof).not.toHaveBeenCalled();
  });

  test('verifyCloudProof throws an error: returns 500', async () => {
    const errorMessage = "Internal World ID SDK error";
    (verifyCloudProof as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const mockRequestBody = {
      proof: '0xerror_proof',
      signal: 'test_signal_sdk_error',
      merkle_root: '0xerror_merkle',
      nullifier_hash: '0xerror_nullifier',
      credential_type: 'orb',
    };

    const request = createMockRequest(mockRequestBody);
    await POST(request);

    expect(mockJson).toHaveBeenCalledWith(
      { 
        error: 'Internal server error during verification',
        detail: errorMessage 
      },
      { status: 500 }
    );
    expect(verifyCloudProof).toHaveBeenCalledWith(
      mockRequestBody.proof,
        'test_app_id',
        'test_action_id',
        mockRequestBody.signal
    );
  });

});

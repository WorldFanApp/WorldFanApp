import { NextResponse } from 'next/server';
import type { IVerifyResponse } from '@worldcoin/idkit'; // Ensure IVerifyResponse is imported as a type

export async function POST(request: Request) {
  const { proof, signal: receivedSignal } = await request.json();

  const APP_ID = process.env.WLD_APP_ID;
  const ACTION_ID = process.env.WLD_ACTION_ID;

  if (!APP_ID || !ACTION_ID) {
    console.error('Missing WLD_APP_ID or WLD_ACTION_ID in environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // Basic validation for required fields
  if (!proof || !receivedSignal) {
    return NextResponse.json({ error: 'Missing proof or signal' }, { status: 400 });
  }

  // The subtask mentions: "The `signal` for proof debugging is `signupSingal`."
  // This implies that for testing/debugging, 'signupSingal' should be used.
  // The current implementation correctly uses `receivedSignal` from the request,
  // which is the standard practice for dynamic signals.

  try {
    // Dynamically import verifyCloudProof
    const { verifyCloudProof } = await import('@worldcoin/idkit');

    // Use IVerifyResponse for the type of the verificationResponse
    const verificationResponse: IVerifyResponse = await verifyCloudProof(
      proof,
      APP_ID,
      ACTION_ID,
      receivedSignal // Use the signal from the request body
    );

    if (verificationResponse.success) {
      return NextResponse.json(verificationResponse, { status: 200 });
    } else {
      // Log the detailed error for server-side debugging
      console.error('World ID Verification Failed:', verificationResponse);
      // Return a generic error or specific details based on `verificationResponse.code` and `verificationResponse.detail`
      // Ensure the structure matches what IVerifyResponse might imply for error (if it has specific error fields)
      return NextResponse.json(
        {
          error: 'Verification failed',
          code: verificationResponse.code, // Assuming 'code' is part of IVerifyResponse on failure
          detail: verificationResponse.detail, // Assuming 'detail' is part of IVerifyResponse on failure
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error during World ID verification:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal server error during verification', detail: errorMessage }, { status: 500 });
  }
}

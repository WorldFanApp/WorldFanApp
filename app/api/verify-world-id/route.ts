import { NextResponse } from 'next/server';
import { verifyCloudProof } from '@worldcoin/idkit';

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
    const verificationResponse = await verifyCloudProof(
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
      return NextResponse.json(
        {
          error: 'Verification failed',
          code: verificationResponse.code,
          detail: verificationResponse.detail,
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

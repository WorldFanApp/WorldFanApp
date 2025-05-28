import { NextRequest, NextResponse } from 'next/server';
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js';

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string | undefined;
}

export async function POST(req: NextRequest) {
  const app_id = process.env.WORLDCOIN_APP_ID as `app_${string}`;

  if (!app_id) {
    console.error('WORLDCOIN_APP_ID is not set in environment variables.');
    return NextResponse.json({
      verified: false,
      message: 'Application ID not configured.',
    }, { status: 500 });
  }

  try {
    const { payload, action, signal }: IRequestPayload = await req.json();

    if (!payload || !action) {
      return NextResponse.json({
        verified: false,
        message: 'Missing required payload or action.',
      }, { status: 400 });
    }

    // Type assertion for verifyCloudProof might be needed if its expected payload type is more generic
    const verifyRes = await verifyCloudProof(payload, app_id, action, signal) as IVerifyResponse;

    if (verifyRes.success) {
      // TODO: Perform backend actions here (e.g., create session, update user status)
      return NextResponse.json({ ...verifyRes, verified: true, message: "Verification successful" }, { status: 200 });
    } else {
      console.error('World ID Cloud Proof verification failed:', verifyRes);
      return NextResponse.json({ ...verifyRes, verified: false, message: "Verification failed" }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing MiniKit verification request:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({
      verified: false,
      message: errorMessage,
      detail: error instanceof Error ? error.toString() : 'Unknown error',
    }, { status: 500 });
  }
}

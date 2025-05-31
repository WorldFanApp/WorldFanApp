import { NextRequest, NextResponse } from 'next/server';
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js';

// Define the expected request body structure
interface IRequestPayload {
  payload: ISuccessResult; // This is the finalPayload from MiniKit on the frontend
  action: string;
  signal?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload;

    if (!payload || !action) {
      return NextResponse.json({ success: false, error: "Missing required parameters: payload and action are required." }, { status: 400 });
    }

    // Retrieve app_id from environment variables
    // The user specified WLD_APP_ID=app_7a9639a92f85fcf27213f982eddb5064
    // Ensure this environment variable is set in your deployment environment.
    const app_id = process.env.WLD_APP_ID as `app_${string}` | undefined;

    if (!app_id) {
      console.error("WLD_APP_ID environment variable is not set.");
      return NextResponse.json({ success: false, error: "Server configuration error: App ID not set." }, { status: 500 });
    }

    // The action from the request body should match the one configured for the app_id
    // Signal can be undefined if not used

    const verifyRes: IVerifyResponse = await verifyCloudProof(payload, app_id, action, signal);

    if (verifyRes.success) {
      // Verification successful
      // Optionally, you can do further checks here, e.g., verifyRes.action matches your expected action
      return NextResponse.json({ success: true, ...verifyRes }, { status: 200 });
    } else {
      // Verification failed
      console.error("Cloud verification failed:", verifyRes);
      return NextResponse.json({ success: false, ...verifyRes }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in verification API route:", error);
    let errorMessage = "An unknown server error occurred during verification.";
    if (error instanceof SyntaxError) { // Error parsing JSON
      errorMessage = "Invalid request body: Please provide valid JSON.";
      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

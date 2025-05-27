import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("Running comprehensive Worldcoin configuration test...")

    const results = {
      timestamp: new Date().toISOString(),
      environment_variables: {
        NEXT_PUBLIC_WORLDCOIN_APP_ID: {
          value: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || null,
          status: !!process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID,
          required: true,
        },
        NEXT_PUBLIC_WORLDCOIN_ACTION: {
          value: process.env.NEXT_PUBLIC_WORLDCOIN_ACTION || null,
          status: !!process.env.NEXT_PUBLIC_WORLDCOIN_ACTION,
          required: true,
        },
        WORLDCOIN_APP_ID: {
          value: process.env.WORLDCOIN_APP_ID ? "Set" : null,
          status: !!process.env.WORLDCOIN_APP_ID,
          required: true,
        },
        WORLDCOIN_CLIENT_SECRET: {
          value: process.env.WORLDCOIN_CLIENT_SECRET ? "Set" : null,
          status: !!process.env.WORLDCOIN_CLIENT_SECRET,
          required: true,
        },
        WORLDCOIN_API_KEY: {
          value: process.env.WORLDCOIN_API_KEY ? "Set" : null,
          status: !!process.env.WORLDCOIN_API_KEY,
          required: true,
        },
      },
      api_key_test: null as any,
      worldcoin_api_test: null as any,
      overall_status: "unknown" as string,
    }

    // Test API key format and extraction
    if (process.env.WORLDCOIN_API_KEY) {
      const apiKey = process.env.WORLDCOIN_API_KEY
      const secretKey = apiKey.includes(":") ? apiKey.split(":")[1] : apiKey
      const keyPreview = secretKey ? `${secretKey.slice(0, 8)}...${secretKey.slice(-4)}` : "Invalid"

      results.api_key_test = {
        has_api_key: true,
        key_format: apiKey.includes(":") ? "Full format (api_key:secret)" : "Secret only",
        key_preview: keyPreview,
        secret_key_length: secretKey?.length || 0,
      }

      // Test Worldcoin API connectivity
      try {
        console.log("Testing Worldcoin API connectivity...")
        const testResponse = await fetch("https://developer.worldcoin.org/api/v1/precheck", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
        })

        results.worldcoin_api_test = {
          connectivity: "success",
          status_code: testResponse.status,
          response_ok: testResponse.ok,
          headers: Object.fromEntries(testResponse.headers.entries()),
        }

        if (testResponse.ok) {
          const responseData = await testResponse.text()
          results.worldcoin_api_test.response_preview = responseData.slice(0, 200)
        }
      } catch (apiError: any) {
        console.error("Worldcoin API test failed:", apiError)
        results.worldcoin_api_test = {
          connectivity: "failed",
          error: apiError.message,
        }
      }
    } else {
      results.api_key_test = {
        has_api_key: false,
        error: "WORLDCOIN_API_KEY environment variable not found",
      }
    }

    // Determine overall status
    const requiredVars = Object.entries(results.environment_variables).filter(([_, config]) => config.required)
    const missingVars = requiredVars.filter(([_, config]) => !config.status)

    if (missingVars.length === 0 && results.api_key_test?.has_api_key) {
      results.overall_status = "ready"
    } else if (missingVars.length > 0) {
      results.overall_status = "missing_variables"
    } else {
      results.overall_status = "configuration_error"
    }

    console.log("Comprehensive test completed:", results.overall_status)

    return NextResponse.json({
      success: results.overall_status === "ready",
      status: results.overall_status,
      results,
      recommendations: generateRecommendations(results),
    })
  } catch (error: any) {
    console.error("Comprehensive test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Comprehensive test failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

function generateRecommendations(results: any): string[] {
  const recommendations: string[] = []

  // Check for missing environment variables
  const missingVars = Object.entries(results.environment_variables)
    .filter(([_, config]: [string, any]) => config.required && !config.status)
    .map(([name, _]) => name)

  if (missingVars.length > 0) {
    recommendations.push(`Add missing environment variables: ${missingVars.join(", ")}`)
  }

  // Check API key issues
  if (!results.api_key_test?.has_api_key) {
    recommendations.push("Add WORLDCOIN_API_KEY to your environment variables")
  } else if (results.api_key_test?.secret_key_length < 20) {
    recommendations.push("Verify your WORLDCOIN_API_KEY format - it may be incomplete")
  }

  // Check API connectivity
  if (results.worldcoin_api_test?.connectivity === "failed") {
    recommendations.push("Check your API key validity - Worldcoin API connectivity failed")
  }

  // Check app configuration
  if (!results.environment_variables.NEXT_PUBLIC_WORLDCOIN_APP_ID?.value) {
    recommendations.push("Set NEXT_PUBLIC_WORLDCOIN_APP_ID in your Worldcoin Developer Portal")
  }

  if (!results.environment_variables.NEXT_PUBLIC_WORLDCOIN_ACTION?.value) {
    recommendations.push("Set NEXT_PUBLIC_WORLDCOIN_ACTION (usually 'signin')")
  }

  if (recommendations.length === 0) {
    recommendations.push("Configuration looks good! Try the World ID verification.")
  }

  return recommendations
}

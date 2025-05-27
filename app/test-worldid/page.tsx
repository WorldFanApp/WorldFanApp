"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js"

export default function TestWorldIDPage() {
  const [status, setStatus] = useState<string>("Initializing...")
  const [logs, setLogs] = useState<string[]>([])
  const [response, setResponse] = useState<any>(null)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
    console.log(message)
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      addLog("Window is available, initializing MiniKit...")

      try {
        MiniKit.install()
        addLog("MiniKit.install() called successfully")

        const isInstalled = MiniKit.isInstalled()
        addLog(`MiniKit.isInstalled(): ${isInstalled}`)

        if (isInstalled) {
          setStatus("MiniKit Ready ✅")
        } else {
          setStatus("MiniKit Not Available ❌")
        }

        // Subscribe to events
        MiniKit.subscribe(ResponseEvent.MiniAppSignIn, (response) => {
          addLog(`Sign-in response received: ${JSON.stringify(response)}`)
          setResponse(response)

          if (response.status === "success") {
            setStatus("Sign-in Successful ✅")
          } else {
            setStatus(`Sign-in Failed: ${response.error?.message || response.error}`)
          }
        })

        addLog("Event subscription set up")
      } catch (error: any) {
        addLog(`MiniKit initialization error: ${error.message}`)
        setStatus(`Error: ${error.message}`)
      }
    }
  }, [])

  const testSignIn = () => {
    addLog("Testing sign-in...")
    setStatus("Attempting sign-in...")

    try {
      const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID
      addLog(`Using app_id: ${appId}`)

      MiniKit.commands.signIn({
        action: "signin",
        app_id: appId!,
      })

      addLog("Sign-in command sent")
      setStatus("Sign-in command sent, waiting for response...")
    } catch (error: any) {
      addLog(`Sign-in error: ${error.message}`)
      setStatus(`Sign-in Error: ${error.message}`)
    }
  }

  const clearLogs = () => {
    setLogs([])
    setResponse(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>World ID MiniKit Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Status: {status}</p>
                <p className="text-sm text-gray-600">App ID: {process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID}</p>
              </div>
              <div className="space-x-2">
                <Button onClick={testSignIn} disabled={!MiniKit.isInstalled()}>
                  Test Sign-In
                </Button>
                <Button onClick={clearLogs} variant="outline">
                  Clear Logs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>User Agent:</strong>
                </p>
                <p className="text-xs break-all">{navigator.userAgent}</p>
              </div>
              <div>
                <p>
                  <strong>URL:</strong>
                </p>
                <p className="text-xs break-all">{window.location.href}</p>
              </div>
              <div>
                <p>
                  <strong>MiniKit Installed:</strong> {MiniKit.isInstalled() ? "✅" : "❌"}
                </p>
                <p>
                  <strong>Has WorldApp:</strong> {typeof (window as any).WorldApp !== "undefined" ? "✅" : "❌"}
                </p>
              </div>
              <div>
                <p>
                  <strong>In iframe:</strong> {window.self !== window.top ? "✅" : "❌"}
                </p>
                <p>
                  <strong>Has parent:</strong> {window.parent !== window ? "✅" : "❌"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {response && (
          <Card>
            <CardHeader>
              <CardTitle>Last Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">{JSON.stringify(response, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Debug Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-xs h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
              {logs.length === 0 && <div>No logs yet...</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

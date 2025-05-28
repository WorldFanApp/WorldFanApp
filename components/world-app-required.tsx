import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WorldAppRequiredProps {
  message?: string
  showMockMessage?: boolean
}

export function WorldAppRequired({ message, showMockMessage = false }: WorldAppRequiredProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-5 w-5 text-yellow-600" />
        <AlertDescription className="text-yellow-800 ml-2">
          {message || "This feature requires the World App to function properly."}
        </AlertDescription>
      </Alert>

      {showMockMessage && process.env.NODE_ENV === "development" && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800 ml-2">
            Development mode: Mock functionality is enabled for testing purposes.
          </AlertDescription>
        </Alert>
      )}

      <p className="text-muted-foreground">
        Please download and open this application in the World App for the full experience.
      </p>

      <Button asChild variant="outline">
        <a
          href="https://worldcoin.org/download"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          Download World App <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    </div>
  )
}

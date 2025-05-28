export default function Head() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Log World App detection
            console.log("Checking for World App...");
            
            // Try to detect World App
            try {
              window.worldAppDetection = {
                isWorldApp: false,
                miniAppBridgeFound: false
              };
              
              if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.miniAppBridge) {
                console.log("Detected World App (iOS)");
                window.worldAppDetection.isWorldApp = true;
                window.worldAppDetection.miniAppBridgeFound = true;
              } else if (window.miniAppBridge) {
                console.log("Detected World App (Android)");
                window.worldAppDetection.isWorldApp = true;
                window.worldAppDetection.miniAppBridgeFound = true;
              } else {
                console.log("Not running in World App");
              }
              
              // Check if MiniKit is available
              if (typeof window.MiniKit !== 'undefined') {
                console.log("MiniKit is available");
                window.worldAppDetection.miniKitAvailable = true;
              } else {
                console.log("MiniKit is not available");
                window.worldAppDetection.miniKitAvailable = false;
              }
            } catch (e) {
              console.error("Error detecting World App:", e);
            }
          `,
        }}
      />
    </>
  )
}

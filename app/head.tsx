export default function Head() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Check if we're in the World App
            window.worldAppDetection = {
              isWorldApp: false,
              checkComplete: false
            };
            
            // Try to detect World App
            try {
              if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.miniAppBridge) {
                window.worldAppDetection.isWorldApp = true;
              } else if (window.miniAppBridge) {
                window.worldAppDetection.isWorldApp = true;
              }
            } catch (e) {
              console.error("Error detecting World App:", e);
            }
            
            window.worldAppDetection.checkComplete = true;
            console.log("World App detection:", window.worldAppDetection);
          `,
        }}
      />
    </>
  )
}

import { useEffect, useRef } from "react";

function BannerAd2() {
  const bannerRef = useRef(null);

  useEffect(() => {
    const container = bannerRef.current;
    if (!container) return;

    // Clean container before injecting to prevent duplicates on re-renders
    container.innerHTML = "";

    // 1. Create an iframe to isolate the ad context
    const iframe = document.createElement("iframe");
    
    // 2. Style the iframe to be seamless
    iframe.width = "300";
    iframe.height = "250";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.scrolling = "no";
    
    // 3. Append iframe to the DOM
    container.appendChild(iframe);

    // 4. Write the ad script INSIDE the iframe
    // This creates a fresh 'window' object for every ad, preventing conflicts
    const iframeDoc = iframe.contentWindow.document;
    
    const adScript = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; }</style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : 'fb471127e857ba4f7fa50d438fd43312',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/fb471127e857ba4f7fa50d438fd43312/invoke.js"></script>
        </body>
      </html>
    `;

    iframeDoc.open();
    iframeDoc.write(adScript);
    iframeDoc.close();

    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div 
      ref={bannerRef} 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        margin: '20px auto', 
        minHeight: '250px',
        minWidth: '300px'
      }} 
    />
  );
}

export default BannerAd2;
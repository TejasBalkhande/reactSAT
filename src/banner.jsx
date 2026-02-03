// banner.jsx
import { useEffect, useRef, useState } from "react";

function BannerAd() {
  const iframeRef = useRef(null);
  
  // 1. Initialize state based on current window width (Mobile threshold: 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 2. Add listener to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Update the Iframe content whenever isMobile changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentWindow.document;

    // Define configurations for Desktop vs Mobile
    const adSettings = isMobile 
      ? {
          // MOBILE CONFIGURATION
          key: '1c65ed0ed89f12800a7aea3cd772220a',
          width: 468,
          height: 60
        }
      : {
          // DESKTOP CONFIGURATION
          key: '79a9753e7d75dc169bbab668869a93da',
          width: 728,
          height: 90
        };

    const adContent = `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;overflow:hidden;display:flex;justify-content:center;align-items:center;">
          <script type="text/javascript">
            atOptions = {
              'key' : '${adSettings.key}',
              'format' : 'iframe',
              'height' : ${adSettings.height},
              'width' : ${adSettings.width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/${adSettings.key}/invoke.js"></script>
        </body>
      </html>
    `;

    // Write the content
    doc.open();
    doc.write(adContent);
    doc.close();

  }, [isMobile]); // Re-run this effect if the screen size category changes

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        margin: '20px auto',
        // Dynamic height to match the ad being shown
        height: isMobile ? '60px' : '90px',
        transition: 'height 0.3s ease'
      }} 
    >
      <iframe 
        ref={iframeRef}
        title="Advertisement"
        // Dynamic dimensions for the iframe element
        width={isMobile ? "468" : "728"}
        height={isMobile ? "60" : "90"}
        frameBorder="0"
        scrolling="no"
        style={{ border: 'none', overflow: 'hidden' }}
      />
    </div>
  );
}

export default BannerAd;
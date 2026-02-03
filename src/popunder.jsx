import { useEffect } from 'react';

const PopUnder = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://pl28593793.effectivegatecpm.com/39/10/1d/39101d7e71d1f3557aafdcb260f40736.js";
    script.async = true;
    
    // Append to body to ensure it executes
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts if necessary
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything UI-wise
};

export default PopUnder;
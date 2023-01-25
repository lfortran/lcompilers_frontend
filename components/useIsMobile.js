import { useEffect, useState } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
    //   const userAgent =
    //     typeof window !== 'undefined' && window.navigator.userAgent;
    //   const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    //   const isMobile = mobileRegex.test(userAgent);
      const isMobile = (window.innerWidth < 768);
      setIsMobile(isMobile);
    };

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
}

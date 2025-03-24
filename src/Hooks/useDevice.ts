import { useEffect, useState } from 'react';
import { DeviceEnum } from '../enums/DeviceEnum';

const useDevice = (): DeviceEnum => {
  const [deviceType, setDevice] = useState<DeviceEnum>(DeviceEnum.PC);

  useEffect(() => {
    const isTouchDevice = () =>
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isPortrait = () =>
      window.screen.orientation?.type.includes('portrait') ||
      window.innerHeight > window.innerWidth;
    const hasMouse = () => 'onmousemove' in window;

    const detectDevice = () => {
      if (isTouchDevice() && isPortrait() && !hasMouse()) {
        setDevice(DeviceEnum.MOBILE);
      } else {
        setDevice(DeviceEnum.PC);
      }
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
    };
  }, []);

  return deviceType;
};

export default useDevice;

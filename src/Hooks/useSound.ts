import { Howl } from 'howler';
import { useEffect, useState } from 'react';

export interface UseSoundProps {
  src: string;
  volume?: number;
  autoplay?: boolean;
  loop?: boolean;
}

const useSound = ({
  src,
  volume,
  autoplay = false,
  loop = false,
}: UseSoundProps) => {
  const [audio, setAudio] = useState<Howl | null>(null);

  useEffect(() => {
    const howl = new Howl({
      src: src,
      onplayerror: (e, d) => {
        console.log('onplayerror', e, d);

        howl.once('unlock', () => {
          // howl.play();
        });
      },
      loop: loop ? true : false,
      volume: volume,
      autoplay: autoplay,
    });

    setAudio(howl);

    return () => {
      howl.unload();
    };
  }, []);

  return [audio] as const;
};

export default useSound;

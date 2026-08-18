import { useEffect, useRef, useState } from 'react';

interface UserVideoInputProps {
  className?: string;
}

export const UserVideoInput = ({ className }: UserVideoInputProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
//   const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let localStream: MediaStream | null = null;

    async function enableCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        
        localStream = mediaStream;
        // setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError('Unable to access camera.');
        console.error(err);
      }
    }

    enableCamera();

    // Use localStream to prevent stale closure bugs on unmount
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className={className}>
      {error && <p className="pixel-font video-error">{error}</p>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
      />
    </div>
  );
}
import { useState, useEffect, useRef } from "react";

interface AudioPlayerWithBufferProps {
  audioBuffer: ArrayBuffer | null;
}

const AudioPlayerWithBuffer: React.FC<AudioPlayerWithBufferProps> = ({
  audioBuffer,
}) => {
  const audioRef = useRef(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState("");

  useEffect(() => {
    if (audioBuffer) {
      // Create a Blob from the ArrayBuffer and generate a Blob URL
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setAudioBlobUrl(url);

      // Cleanup the URL object when component unmounts or buffer changes
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBuffer]);

  return (
    <div>
      {audioBlobUrl ? (
        <audio ref={audioRef} src={audioBlobUrl} controls />
      ) : (
        <p>Loading audio...</p>
      )}
    </div>
  );
};

export default AudioPlayerWithBuffer;

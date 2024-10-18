import { useState, useEffect } from "react";

const useAudioLoader = (url: string) => {
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/load/audio`, {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioUrl: url }),
          method: "POST",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        setAudioUrl(URL.createObjectURL(blob));
      } catch (e) {
        setError(
          e instanceof Error ? e : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };
    console.log("Fetching audio from URL:", url);
    fetchAudio();
  }, [url]);

  return { audioUrl, isLoading, error };
};

export default useAudioLoader;

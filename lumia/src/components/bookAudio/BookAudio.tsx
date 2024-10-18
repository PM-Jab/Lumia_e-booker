import React, { CSSProperties, useEffect, useRef, useState } from "react";
import "./BookAudio.css";

const BookAudio = () => {
  const audioUrls = [
    "https://r2-worker.testaudio.workers.dev/the-psychology-of-money_bill-oxley_chapter1_page22",
    "https://r2-worker.testaudio.workers.dev/the-psychology-of-money_bill-oxley_chapter1_page23",
    "https://r2-worker.testaudio.workers.dev/the-psychology-of-money_bill-oxley_chapter1_page24",
  ];

  const [isPlaying, setIsPlaying] = useState(false); // State to track play status
  const [isStopped, setIsStopped] = useState(true); // State to track stop status
  const [currentTime, setCurrentTime] = useState(0); // Current playback time
  const [duration, setDuration] = useState(0); // Duration of the combined audio
  const audioContextRef = useRef<AudioContext | null>(null); // Ref to hold the audio context
  const audioBufferRef = useRef<AudioBuffer | null>(null); // Ref to hold the combined audio buffer
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null); // Ref for the current audio source node
  const startTimeRef = useRef<number | null>(null); // To track the start time for seeking
  const [isSeeking, setIsSeeking] = useState(false); // State to track whether user is seeking

  // Function to fetch, decode, and combine audio files
  const fetchAndCombineAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;

    // Fetch and decode all audio files
    const audioBuffers = await Promise.all(
      audioUrls.map(async (url) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await audioContext.decodeAudioData(arrayBuffer);
      })
    );

    // Calculate the total length of all audio buffers combined
    const totalLength = audioBuffers.reduce(
      (sum, buffer) => sum + buffer.length,
      0
    );

    // Create a new buffer to hold the combined audio data
    const combinedBuffer = audioContext.createBuffer(
      audioBuffers[0].numberOfChannels,
      totalLength,
      audioBuffers[0].sampleRate
    );

    // Copy each audio buffer into the combined buffer
    let offset = 0;
    audioBuffers.forEach((buffer) => {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        combinedBuffer
          .getChannelData(channel)
          .set(buffer.getChannelData(channel), offset);
      }
      offset += buffer.length;
    });

    audioBufferRef.current = combinedBuffer; // Store the combined buffer
    setDuration(combinedBuffer.duration); // Set the total duration
  };

  // Function to play the combined audio buffer
  const playCombinedAudio = () => {
    if (audioContextRef.current && audioBufferRef.current) {
      const audioContext = audioContextRef.current;

      // Stop any currently playing audio
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
      }

      const audioSource = audioContext.createBufferSource();
      audioSource.buffer = audioBufferRef.current; // Set the combined buffer as the source
      audioSource.connect(audioContext.destination); // Connect to the output (speakers)

      const currentTimeInAudio = isSeeking ? currentTime : 0;
      audioSource.start(0, currentTimeInAudio); // Start playing from currentTime if seeking

      startTimeRef.current = audioContext.currentTime - currentTimeInAudio; // Track the start time for seeking

      audioSourceRef.current = audioSource; // Store the current audio source node
      setIsPlaying(true);
      setIsStopped(false);

      // Stop playing once the audio is finished
      audioSource.onended = () => {
        setIsPlaying(false);
        setIsStopped(true);
      };
    }
  };

  // Function to pause the audio
  const pauseAudio = () => {
    if (audioContextRef.current && isPlaying) {
      audioContextRef.current.suspend(); // Suspend the audio context (pauses the audio)
      setIsPlaying(false);
    }
  };

  // Function to resume the paused audio
  const resumeAudio = () => {
    if (audioContextRef.current && !isPlaying) {
      audioContextRef.current.resume(); // Resume the audio context (plays the audio again)
      setIsPlaying(true);
    }
  };

  // Function to stop the audio completely
  const stopAudio = () => {
    if (audioContextRef.current && audioSourceRef.current) {
      audioSourceRef.current.stop(); // Stop the current audio source node
      setIsPlaying(false);
      setIsStopped(true);
      setCurrentTime(0); // Reset current time
    }
  };

  // Function to handle play button click
  const handlePlay = async () => {
    if (!audioBufferRef.current) {
      await fetchAndCombineAudio(); // Fetch and combine audio if not done yet
    }
    playCombinedAudio(); // Play the combined audio
  };

  // Function to handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime); // Update the current time as user seeks
    setIsSeeking(true);
  };

  // Sync current time with the playing audio in real-time
  useEffect(() => {
    let interval: number;
    if (isPlaying && audioContextRef.current) {
      interval = window.setInterval(() => {
        if (audioContextRef.current && startTimeRef.current !== null) {
          const elapsedTime =
            audioContextRef.current.currentTime - startTimeRef.current;
          setCurrentTime(elapsedTime);
        }
      }, 1000);
    }
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [isPlaying]);

  useEffect(() => {
    // Clean up audio context when the component unmounts
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h3>Book Audio Player</h3>

      {/* Current Time and Duration Display */}
      <div>
        <span>
          Current Time: {currentTime.toFixed(2)} / {duration.toFixed(2)} seconds
        </span>
      </div>

      {/* Seek Bar */}
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        onMouseUp={() => {
          setIsSeeking(false); // Re-enable normal play after seeking
          playCombinedAudio(); // Replay the audio from the new time
        }}
      />

      {/* Audio Controls */}
      <button onClick={handlePlay} disabled={isPlaying}>
        {isPlaying ? "Playing..." : "Play"}
      </button>
      <button onClick={pauseAudio} disabled={!isPlaying || isStopped}>
        Pause
      </button>
      <button onClick={resumeAudio} disabled={isPlaying || isStopped}>
        Resume
      </button>
      <button onClick={stopAudio} disabled={isStopped}>
        Stop
      </button>
    </div>
  );
};

export default BookAudio;

import React, { useEffect, useRef, useState } from "react";
import "./AudioPlayer.css";
import { useBook } from "@/context/bookContext";

interface AudioPlayerProps {
  onPageChange: (isNextPage: boolean) => void;
  src: string;
  isAutoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onPageChange, src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { setHighlightIndex, pageData } = useBook();
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetPage = (isAutoPlay: boolean) => {
    setHighlightIndex(0);
    isAutoPlay ? playAudio() : pauseAudio();
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    }
  };

  const Highlighting = () => {
    const currentTime = audioRef.current
      ? audioRef.current.currentTime * 1000
      : 0;
    const sentenceEndTimes = pageData?.sentenceEndTimes;
    const sentences = pageData?.sentences;

    const newIndex = sentenceEndTimes?.findIndex(
      (endTime) => currentTime <= endTime * 1000
    );

    if (sentences && newIndex !== undefined) {
      setHighlightIndex(newIndex >= 0 ? newIndex : sentences.length - 1);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    resetPage(isAutoPlay);
  }, [pageData]);

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={Highlighting}
        autoPlay={isAutoPlay}
        onEnded={() => onPageChange(true)}
        controls={true}
        // onPlay={togglePlayPause}
        // onPause={togglePlayPause}
      />
      {/* <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button> */}
      {/* <div>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleTimeUpdate}
        />
        <div>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div> */}
    </div>
  );
};

export default AudioPlayer;

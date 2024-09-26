import React, { use, useEffect, useRef, useState } from "react";
import "./AudioPlayer.css";
import { useBook } from "@/context/bookContext";
import {
  startTimer,
  stopTimer,
  resetTimer,
  getElapsedTime,
} from "@/utils/timer";

interface AudioPlayerProps {
  src: string;
  duration: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const { setHighlightIndex, pageData, currentPage } = useBook();
  const speed = 1;
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        stopTimer();
      } else {
        audioRef.current.play();
        startTimer();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const updateHighlight = () => {
    const currentTime = getElapsedTime();

    const newIndex = pageData?.sentenceEndTimes.findIndex(
      (endTime) => currentTime <= endTime * 1000
    );

    if (pageData?.sentences && newIndex !== undefined) {
      setHighlightIndex(
        newIndex >= 0 ? newIndex : pageData?.sentences.length - 1
      );
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateHighlight);
    }
    return () => {
      audioRef.current?.removeEventListener("timeupdate", updateHighlight);
    };
  }, [isPlaying]);

  useEffect(() => {
    setHighlightIndex(0);
    resetTimer();
    setIsPlaying(false);
  }, [pageData]);

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={pageData?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
      />
      <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <div>
        <input
          type="range"
          min="0"
          max={pageData?.duration}
          value={currentTime}
          onChange={handleSeek}
        />
        <div>
          {formatTime(currentTime)} /{" "}
          {formatTime(pageData?.duration ? pageData.duration : 0)}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

import React, { use, useEffect, useRef, useState } from "react";
import "./AudioPlayer.css";
import { useBookChapter } from "@/context/bookChapterContext";
import Highlighting from "@/components/chapterReader/highlighting/Highlighting";

interface AudioPlayerProps {
  onPageChange: (isNextPage: boolean) => void;
  // src: string;
  isAutoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onPageChange }) => {
  const [audioBuffer, setAudioBuffer] = useState<ArrayBuffer | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState("");
  const {
    setHighlightIndex,
    pageIndex,
    setPageIndex,
    timestampEndPages,
    timestampStartPages,
    sentenceEndTimes,
    audioChapterUrl,
    pageChangeFromClick,
  } = useBookChapter();

  const fetchAudio = async () => {
    try {
      const response = await fetch("http://localhost:3001/load/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioUrl: audioChapterUrl,
        }),
      });
      // if (audioBuffer) {
      //   const newBuffer = await response.arrayBuffer();
      // const combinedBuffer = new Uint8Array(
      //   audioBuffer.byteLength + newBuffer.byteLength
      // );
      // combinedBuffer.set(new Uint8Array(audioBuffer), 0);
      // combinedBuffer.set(new Uint8Array(newBuffer), audioBuffer.byteLength);
      // const arrayBuffer = combinedBuffer.buffer;
      // setAudioBuffer(arrayBuffer);
      // } else {
      const arrayBuffer = await response.arrayBuffer();
      setAudioBuffer(arrayBuffer);
      // }
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  useEffect(() => {
    fetchAudio();
  }, [audioChapterUrl]);

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

  const updateHighlightIndex = (currentTime: number) => {
    console.log("Current page index:", pageIndex);
    const highlightIndex = sentenceEndTimes[pageIndex].findIndex(
      (time) => currentTime < time
    );
    // console.log("Current highlight index:", highlightIndex);
    setHighlightIndex(highlightIndex);
  };

  const onAudioTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current?.currentTime || 0;
      console.log("Current time:", currentTime);
      updateHighlightIndex(currentTime);

      const newPageIndex = timestampEndPages.findIndex(
        (time) => currentTime < time
      );
      if (newPageIndex !== -1 && newPageIndex !== pageIndex) {
        setPageIndex(newPageIndex);
      }
    }
  };

  const manualChangePage = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = timestampStartPages[pageIndex];
    }
  };

  useEffect(() => {
    manualChangePage();
  }, [pageChangeFromClick]);

  return (
    <div>
      {audioBlobUrl ? (
        <audio
          ref={audioRef}
          src={audioBlobUrl}
          onTimeUpdate={onAudioTimeUpdate}
          onEnded={() => onPageChange(true)}
          autoPlay
          controls
        />
      ) : (
        <p>Loading audio...</p>
      )}
    </div>
  );
};

export default AudioPlayer;

import React, { useEffect, useRef, useState } from "react";
import { useBook, chunkPage } from "@/context/bookContext";
import {
  startTimer,
  stopTimer,
  resetTimer,
  getElapsedTime,
} from "@/utils/timer";

type BookAudioProps = {
  text: chunkPage;
  audioSrc: string;
  totalDuration: number; // in seconds
};

interface BookAudioReaderProps {
  text: string[];
  audioSrc: string;
  audioDuration: number;
  audioMetadata: number[];
}

const BookAudio: React.FC<BookAudioReaderProps> = ({
  text,
  audioSrc,
  audioDuration,
  audioMetadata,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { book } = useBook();

  // const paragraphEndTimes: number[] = audioMetadata.map(
  //   (duration) => duration * 1000
  // );

  // const handlePlayPause = () => {
  //   if (audioRef.current) {
  //     if (isPlaying) {
  //       pauseAudio();
  //     } else {
  //       playAudio();
  //     }
  //   }
  // };

  // const playAudio = () => {
  //   if (audioRef.current) {
  //     audioRef.current.play();
  //     startTimer();
  //     setIsPlaying(true);
  //   }
  // };

  // const pauseAudio = () => {
  //   if (audioRef.current) {
  //     audioRef.current.pause();
  //     stopTimer();
  //     setIsPlaying(false);
  //   }
  // };
  // const updateHighlight = () => {
  //   const currentTime = getElapsedTime();

  //   const newIndex = paragraphEndTimes.findIndex(
  //     (endTime) => currentTime <= endTime
  //   );

  //   setHighlightIndex(newIndex >= 0 ? newIndex : text.length - 1);
  // };

  // useEffect(() => {
  //   if (audioRef.current) {
  //     audioRef.current.addEventListener("timeupdate", updateHighlight);
  //   }
  //   return () => {
  //     audioRef.current?.removeEventListener("timeupdate", updateHighlight);
  //   };
  // }, [isPlaying]);

  return (
    <div className="book-audio-reader">
      {book.length > 0 ? (
        <div className="book-content">
          {book[0].map((sentence, index) => {
            return (
              <span
                key={index}
                className={index % 2 === 0 ? "bg-yellow-200" : "bg-lime-300"}
              >
                {sentence}
              </span>
            );
          })}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {/* <div className="audio-panel">
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <audio ref={audioRef} src={audioSrc} />
      </div> */}
      <style jsx>{`
        .book-audio-reader {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #f9f9f9;
        }
        .book-content {
          font-family: "Times New Roman", serif;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        p.highlighted {
          background-color: yellow;
        }
        .audio-panel {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          background-color: #0070f3;
          color: white;
        }
        button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default BookAudio;

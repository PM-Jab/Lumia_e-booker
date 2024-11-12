import React, { use, useEffect, useState } from "react";
import BookArea from "../bookArea/BookArea";
import AudioPlayer from "../audioPlayer/AudioPlayer";
import { useBookChapter } from "@/context/bookChapterContext";
import SummaryPage from "@/app/summary/page";

interface BookReaderProps {
  onPageChange: (isNextPage: boolean) => void;
}

const BookReader: React.FC<BookReaderProps> = ({ onPageChange }) => {
  const { sentences, highlightIndex, pageIndex } = useBookChapter();
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [currentSentence, setCurrentSentence] = useState<string[]>([]);
  // console.log("BookReader pageIndex: ", pageIndex);
  useEffect(() => {
    if (sentences[pageIndex]) {
      setCurrentSentence(sentences[pageIndex]);
    }
  }, [pageIndex]);

  useEffect(() => {
    if (sentences[pageIndex]) {
      setCurrentSentence(sentences[0]);
    }
  }, [sentences]);

  return (
    <div className="book-reader">
      <AudioPlayer onPageChange={onPageChange} isAutoPlay={isAutoPlay} />
      <BookArea onPageChange={onPageChange} sentences={currentSentence} />
      {/* 
      {highlightIndex !== null && pageData !== null && pageData.sentences && (
        <div className="fixed bottom-10 left-0 right-0 flex justify-center p-4 bg-orange-300">
          {pageData.sentences[highlightIndex]}
        </div>
      )} */}
    </div>
  );
};

export default BookReader;

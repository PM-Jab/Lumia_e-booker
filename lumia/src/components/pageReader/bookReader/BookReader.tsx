import React, { use, useEffect, useState } from "react";
import BookArea from "../bookArea/BookArea";
import AudioPlayer from "../audioPlayer/AudioPlayer";
import { useBook } from "@/context/bookContext";
import SummaryPage from "@/app/summary/page";

interface BookReaderProps {
  onPageChange: (isNextPage: boolean) => void;
}

const BookReader: React.FC<BookReaderProps> = ({ onPageChange }) => {
  const { highlightIndex, pageData } = useBook();
  const [hideSummary, setHideSummary] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  return (
    <div className="book-reader">
      <AudioPlayer
        onPageChange={onPageChange}
        src={pageData?.audioUrl || ""}
        isAutoPlay={isAutoPlay}
      />
      <BookArea
        onPageChange={onPageChange}
        sentences={pageData?.sentences || []}
      />
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

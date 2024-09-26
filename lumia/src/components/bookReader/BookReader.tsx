import React, { use, useEffect, useState } from "react";
import BookArea from "../BookArea";
import AudioPlayer from "../audioPlayer/AudioPlayer";
import { useBook } from "@/context/bookContext";

interface BookReaderProps {
  onPageChange: (isNextPage: boolean) => void;
}

const BookReader: React.FC<BookReaderProps> = ({ onPageChange }) => {
  const { highlightIndex, pageData } = useBook();
  useEffect(() => {}, []);
  return (
    <div className="book-reader">
      <AudioPlayer
        src={pageData?.audioUrl || ""}
        duration={pageData?.duration || 0}
      />
      <BookArea
        onPageChange={onPageChange}
        sentences={pageData?.sentences || []}
      />

      {highlightIndex !== null && pageData !== null && pageData.sentences && (
        <div className="fixed bottom-10 left-0 right-0 flex justify-center p-4 bg-orange-300">
          {pageData.sentences[highlightIndex]}
        </div>
      )}
    </div>
  );
};

export default BookReader;

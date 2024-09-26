import React, { useRef, useEffect, useState, use } from "react";
import { exampleBookPage } from "@/constants/book";
import "./BookArea.css"; // Make sure to import the CSS file
import { useBook } from "@/context/bookContext";

interface BookAreaProps {
  onPageChange: (isNextPage: boolean) => void;
  sentences: string[];
}

const BookArea: React.FC<BookAreaProps> = ({ onPageChange, sentences }) => {
  const { pageData, currentPage, setHighlightIndex, highlightIndex } =
    useBook();
  let textRef = useRef<HTMLDivElement>(null);
  console.log(currentPage);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, currentTarget } = event;
    const { left, width } = currentTarget.getBoundingClientRect();

    const textWidth = textRef.current ? textRef.current.offsetWidth : 0;
    const marginWidth = (width - textWidth) / 2;

    if (clientX - left < marginWidth) {
      onPageChange(false); // Previous page
    } else if (clientX - left > width - marginWidth) {
      onPageChange(true); // Next page
    }
  };

  // useEffect(() => {}, [pageData]);

  return (
    <div className="book-container" onClick={handleClick}>
      {sentences.length > 0 ? (
        <div className="book-text" ref={textRef}>
          {sentences.map((sentence, index) => {
            return (
              <span
                key={index}
                className={
                  index === highlightIndex ? "bg-yellow-200" : "opacity-50"
                }
              >
                {sentence}
              </span>
            );
          })}
          <div>{"\n\n\n\n\n\n\n"}</div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BookArea;

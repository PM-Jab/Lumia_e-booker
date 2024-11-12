import React, { useRef, useEffect, useState, use } from "react";
import "./BookArea.css"; // Make sure to import the CSS file
import { useBookChapter } from "@/context/bookChapterContext";

interface BookAreaProps {
  onPageChange: (isNextPage: boolean) => void;
  sentences: string[];
}

const BookArea: React.FC<BookAreaProps> = ({ onPageChange, sentences }) => {
  const { highlightIndex, setPageChangeFromClick, pageChangeFromClick } =
    useBookChapter();
  let textRef = useRef<HTMLDivElement>(null);
  // console.log("sentences", sentences);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, currentTarget } = event;
    const { left, width } = currentTarget.getBoundingClientRect();

    const textWidth = textRef.current ? textRef.current.offsetWidth : 0;
    const marginWidth = (width - textWidth) / 2;

    if (clientX - left < marginWidth) {
      onPageChange(false); // Previous page
      setPageChangeFromClick(!pageChangeFromClick);
    } else if (clientX - left > width - marginWidth) {
      onPageChange(true); // Next page
      setPageChangeFromClick(!pageChangeFromClick);
    }
  };

  // useEffect(() => {}, [sentences]);

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
                  // index % 2 === 0 ? "bg-yellow-200" : "bg-green-200"
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

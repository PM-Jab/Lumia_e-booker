"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for your context value

interface BookChapterContextType {
  chapterIndex: number;
  setChapterIndex: (index: number) => void;

  pageIndex: number;
  setPageIndex: (index: number) => void;

  timestampEndPages: number[];
  setTimestampEndPages: (timestamps: number[]) => void;

  timestampStartPages: number[];
  setTimestampStartPages: (timestamps: number[]) => void;

  sentences: string[][];
  setSentences: (sentences: string[][]) => void;

  sentenceEndTimes: number[][];
  setSentenceEndTimes: (times: number[][]) => void;

  audioChapterUrl: string;
  setAudioChapterUrl: (url: string) => void;

  totalPage: number;
  setTotalPage: (total: number) => void;

  highlightIndex: number;
  setHighlightIndex: (index: number) => void;

  pageChangeFromClick: boolean;
  setPageChangeFromClick: (isFromClick: boolean) => void;

  audioDuration: number;
  setAudioDuration: (duration: number) => void;
}

// Create the context with an initial value of null
const BookChapterContext = createContext<BookChapterContextType | undefined>(
  undefined
);

// Create a provider component
export const BookChapterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chapterIndex, setChapterIndex] = useState<number>(1);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [timestampEndPages, setTimestampEndPages] = useState<number[]>([]);
  const [timestampStartPages, setTimestampStartPages] = useState<number[]>([]);
  const [sentences, setSentences] = useState<string[][]>([]);
  const [sentenceEndTimes, setSentenceEndTimes] = useState<number[][]>([]);
  const [audioChapterUrl, setAudioChapterUrl] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number>(0);

  const [highlightIndex, setHighlightIndex] = useState<number>(0);

  const [pageChangeFromClick, setPageChangeFromClick] =
    useState<boolean>(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  return (
    <BookChapterContext.Provider
      value={{
        chapterIndex,
        setChapterIndex,

        pageIndex,
        setPageIndex,

        timestampEndPages,
        setTimestampEndPages,

        timestampStartPages,
        setTimestampStartPages,

        sentences,
        setSentences,

        sentenceEndTimes,
        setSentenceEndTimes,

        audioChapterUrl,
        setAudioChapterUrl,

        totalPage,
        setTotalPage,

        highlightIndex,
        setHighlightIndex,

        pageChangeFromClick,
        setPageChangeFromClick,

        audioDuration,
        setAudioDuration,
      }}
    >
      {children}
    </BookChapterContext.Provider>
  );
};

// Custom hook to use the BookContext
export const useBookChapter = () => {
  const context = useContext(BookChapterContext);
  if (context === undefined) {
    throw new Error("useBook must be used within a BookProvider");
  }
  return context;
};

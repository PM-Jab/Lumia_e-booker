"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for your context value
export type pageAudioTimeEnd = number[];
export type page = {
  sentences: string[];
  sentenceEndTimes: number[];
  audioUrl: string;
  duration: number;
};

interface BookContextType {
  book: page[];
  setBook: React.Dispatch<React.SetStateAction<page[]>>;

  highlightIndex: number | null;
  setHighlightIndex: React.Dispatch<React.SetStateAction<number | null>>;

  audioMetadata: pageAudioTimeEnd[];
  setAudioMetadata: React.Dispatch<React.SetStateAction<pageAudioTimeEnd[]>>;

  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  pageData: page | null;
  setPageData: React.Dispatch<React.SetStateAction<page | null>>;

  currentChapter: number;
  setCurrentChapter: React.Dispatch<React.SetStateAction<number>>;

  chapterData: page[];
  setChapterData: React.Dispatch<React.SetStateAction<page[]>>;

  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context with an initial value of null
const BookContext = createContext<BookContextType | undefined>(undefined);

// Create a provider component
export const BookProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [book, setBook] = useState<page[]>([]);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [audioMetadata, setAudioMetadata] = useState<pageAudioTimeEnd[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [pageData, setPageData] = useState<page | null>(null);
  const [chapterData, setChapterData] = useState<page[]>([]);
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  return (
    <BookContext.Provider
      value={{
        book,
        setBook,

        highlightIndex,
        setHighlightIndex,

        audioMetadata,
        setAudioMetadata,

        currentPage,
        setCurrentPage,

        pageData,
        setPageData,

        currentChapter,
        setCurrentChapter,

        chapterData,
        setChapterData,

        totalPages,
        setTotalPages,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

// Custom hook to use the BookContext
export const useBook = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBook must be used within a BookProvider");
  }
  return context;
};

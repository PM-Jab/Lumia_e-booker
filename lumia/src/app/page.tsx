"use client";
import React, { useEffect, useState } from "react";
import TextBox from "@/components/TextBox";
import BookArea from "@/components/BookArea";
import { exampleBookPage, mockPageData } from "@/constants/book";
import { page, useBook } from "@/context/bookContext";
import BookReader from "@/components/bookReader/BookReader";
import BookAudio from "@/components/bookAudio/BookAudio";
import { mock } from "node:test";
import { resetTimer } from "@/utils/timer";

interface HomeProps {
  initialText?: string; // Optional initial text for SSR
}

const Home: React.FC<HomeProps> = () => {
  const {
    currentPage,
    setCurrentPage,
    currentChapter,
    setCurrentChapter,
    chapter,
    setChapter,

    setPageData,
    pageData,
    setHighlightIndex,
  } = useBook();

  // const [lastPage, setLastPage] = useState<boolean>(false);
  const handleChangePage = (isNextPage: boolean) => {
    const totalPages = 11;
    if (isNextPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage % totalPages);
    } else {
      const nextPage = totalPages + currentPage - 1;
      setCurrentPage(nextPage % totalPages);
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/book/the-psychology-of-money/page/${
            currentPage + 1
          }/inquiry`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        const data: page = await response.json();
        console.log("API response data:", data);
        if (data) {
          setPageData(data);
        } else {
          setPageData(mockPageData);
          throw new Error("Invalid API response structure");
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBook();
  }, [currentChapter, currentPage]);

  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <div className="text-2xl font-bold">The Psychology Of Money</div>
      <div className="container">
        <BookReader onPageChange={handleChangePage} />
      </div>
    </main>
  );
};

export default Home;

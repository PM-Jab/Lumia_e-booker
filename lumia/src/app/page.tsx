"use client";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { mockPageData } from "@/constants/book";
import { page, useBook } from "@/context/bookContext";
import BookReader from "@/components/bookReader/BookReader";
import BookAudio from "@/components/bookAudio/BookAudio";
import SummaryButton from "@/components/summaryButton/SummaryButton";

interface HomeProps {
  initialText?: string; // Optional initial text for SSR
}

const Home: React.FC<HomeProps> = () => {
  const {
    currentPage,
    setCurrentPage,

    currentChapter,
    setCurrentChapter,

    chapterData,
    setChapterData,

    setPageData,
    pageData,
    setHighlightIndex,

    totalPages,
    setTotalPages,
  } = useBook();
  const [hideSummary, setHideSummary] = useState(false);

  const handleChangePage = (isNextPage: boolean) => {
    if (isNextPage) {
      const nextPage = currentPage + 1;
      if (nextPage < totalPages) {
        setCurrentPage(nextPage);
        setPageData(chapterData[nextPage]);
      } else {
        console.log("End of chapter");
      }
    } else {
      const prevPage = currentPage - 1;
      if (prevPage >= 1) {
        setCurrentPage(prevPage);
        setPageData(chapterData[prevPage]);
      }
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/book/the-psychology-of-money/chapter/${
            currentChapter + 1
          }/inquiry`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const pages: page[] = await response.json();
        console.log("API response data:", pages);
        if (pages) {
          setChapterData(pages);
          setPageData(pages[currentPage]);
          setTotalPages(pages.length);
        } else {
          setChapterData([mockPageData]);
          setPageData(mockPageData);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBook();
  }, [currentChapter]);

  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <div className="text-2xl font-bold">The Psychology Of Money</div>
      <div className="container">
        {/* <BookReader onPageChange={handleChangePage} /> */}
        <BookAudio />
      </div>
    </main>
  );
};

export default Home;

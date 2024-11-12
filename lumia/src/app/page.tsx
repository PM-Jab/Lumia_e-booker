"use client";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { mockPageData } from "@/constants/book";
import { page, useBook } from "@/context/bookContext";
import { useBookChapter } from "@/context/bookChapterContext";
import BookReader from "@/components/chapterReader/bookReader/BookReader";
import BookAudio from "@/components/bookAudio/BookAudio";
import SummaryButton from "@/components/summaryButton/SummaryButton";

interface HomeProps {
  initialText?: string; // Optional initial text for SSR
}

const Home: React.FC<HomeProps> = () => {
  // const {
  //   currentPage,
  //   setCurrentPage,

  //   currentChapter,
  //   setCurrentChapter,

  //   chapterData,
  //   setChapterData,

  //   setPageData,
  //   pageData,
  //   setHighlightIndex,

  //   totalPages,
  //   setTotalPages,
  // } = useBook();
  const {
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
  } = useBookChapter();
  const [hideSummary, setHideSummary] = useState(false);

  // const handleChangePage = (isNextPage: boolean) => {
  //   if (isNextPage) {
  //     const nextPage = currentPage + 1;
  //     if (nextPage < totalPages) {
  //       setCurrentPage(nextPage);
  //       setPageData(chapterData[nextPage]);
  //     } else {
  //       console.log("End of chapter");
  //     }
  //   } else {
  //     const prevPage = currentPage - 1;
  //     if (prevPage >= 1) {
  //       setCurrentPage(prevPage);
  //       setPageData(chapterData[prevPage]);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const fetchBook = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:3001/book/the-psychology-of-money/chapter/${
  //           currentChapter + 1
  //         }/inquiry`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       const pages: page[] = await response.json();
  //       console.log("API response data:", pages);
  //       if (pages) {
  //         setChapterData(pages);
  //         setPageData(pages[currentPage]);
  //         setTotalPages(pages.length);
  //       } else {
  //         setChapterData([mockPageData]);
  //         setPageData(mockPageData);
  //         setTotalPages(1);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching book data:", error);
  //     }
  //   };

  //   fetchBook();
  // }, [currentChapter]);

  const handleChangePage = (isNextPage: boolean) => {
    console.log("changing page");
    if (isNextPage) {
      const nextPage = pageIndex + 1;
      if (nextPage < totalPage) {
        setPageIndex(nextPage);
      } else {
        console.log("End of chapter");

        if (chapterIndex + 1 < 7) {
          setChapterIndex(chapterIndex + 1);
          setPageIndex(0);
        }
      }
    } else {
      const prevPage = pageIndex - 1;
      if (prevPage >= 0) {
        setPageIndex(prevPage);
      } else {
        if (chapterIndex - 1 >= 0) {
          setChapterIndex(chapterIndex - 1);
          setPageIndex(0);
        }
      }
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/book/The-Psychology-of-Money/${
            chapterIndex + 1
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data) {
          console.log("API response data:", data);
          setSentences(data.sentences);
          setTimestampStartPages(data.firstWordStartTime);
          setTimestampEndPages(data.lastWordEndTime);
          setSentenceEndTimes(data.sentenceEndTimes);
          setAudioChapterUrl(data.audioUrl);
          setTotalPage(data.total);
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBook();
  }, [chapterIndex]);

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

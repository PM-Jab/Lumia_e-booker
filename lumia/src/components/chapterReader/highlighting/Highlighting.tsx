import { getElapsedTime } from "../../../utils/timer";
import { useBookChapter } from "../../../context/bookChapterContext";

const Highlighting = (currentTime: number) => {
  const {
    setHighlightIndex,
    setPageIndex,
    timestampEndPages,
    sentenceEndTimes,
  } = useBookChapter();

  const pageIndex = timestampEndPages.findIndex((time) => currentTime < time);
  setPageIndex(pageIndex);

  const highlightIndex = sentenceEndTimes[pageIndex].findIndex(
    (time) => currentTime < time
  );
  setHighlightIndex(highlightIndex);
};

export default Highlighting;

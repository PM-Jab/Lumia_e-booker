import { getElapsedTime } from "../../../utils/timer";
import { useBook } from "../../../context/bookContext";

const Highlighting = () => {
  const { setHighlightIndex, pageData } = useBook();
  const currentTime = getElapsedTime();
  const sentenceEndTimes = pageData?.sentenceEndTimes;
  const sentences = pageData?.sentences;

  const newIndex = sentenceEndTimes?.findIndex(
    (endTime) => currentTime <= endTime * 1000
  );

  if (sentences && newIndex !== undefined) {
    setHighlightIndex(newIndex >= 0 ? newIndex : sentences.length - 1);
  }
};

export default Highlighting;

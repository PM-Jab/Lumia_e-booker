import { getData } from "../repository/mongo";
import wordToSentence from "../utils/wordToSentence";

const checkWord = (words) => {
  for (const word of words) {
    if (word.includes("\n\n") && word.split("\n\n")[1] !== "") {
      return false;
    } else if (word.includes("\n") && word.split("\n")[1] !== "") {
      return false;
    }
  }
  return true;
};

const putSpace = (arrayWord) => {
  const words = [];
  for (const word of arrayWord) {
    if (!word.includes("\n\n") && !word.includes("\n")) {
      words.push(word + " ");
    } else {
      words.push(word);
    }
  }
  return words;
};

const chapterDetailInquiry = async (collectionName, chapterNum, db) => {
  try {
    // console.log("Data retrieving...");
    const data = await getData(collectionName, { chapter: chapterNum }, db);

    const timestampEndPages = [];
    const timestampStartPages = [];
    const sentenceOfPages = [];
    const sentenceEndTimeOnPages = [];
    const audioChapterUrl = "";
    for (let i = 0; i < data.length; i++) {
      const { page, duration, audioUrl } = data[i];
      const { sentences, sentenceEndTimes, sentenceStartTimes } =
        wordToSentence(
          data[i].words,
          data[i].timestampOfWord.continue,
          data[i].timestampOfWord.end // ! not continue
        );

      if (!checkWord(data[i].words)) {
        console.log(
          "Error: word contains more than one sentence at page ",
          page
        );
      }
      timestampEndPages.push(sentenceEndTimes[sentenceEndTimes.length - 1]);
      timestampStartPages.push(sentenceStartTimes[0]);

      sentenceOfPages.push(sentences);
      sentenceEndTimeOnPages.push(sentenceEndTimes);
    }

    return {
      timestampEndPages,
      timestampStartPages,
      sentences: sentenceOfPages,
      sentenceEndTimes: sentenceEndTimeOnPages,
    };
  } catch (error) {
    console.error(error);
  }
};

export default chapterDetailInquiry;

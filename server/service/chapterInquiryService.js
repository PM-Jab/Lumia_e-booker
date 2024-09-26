import { getData } from "../repository/mongo";
import wordToSentence from "../utils/wordToSentence";

const chapterInquiry = async (collectionName, chapterNum, db) => {
  try {
    console.log("Data retrieving...");
    const data = await getData(collectionName, { chapter: chapterNum }, db);
    const pages = [];
    for (let i = 0; i < data.length; i++) {
      const { page, duration, audioUrl } = data[i];
      const { sentences, sentenceEndTimes } = wordToSentence(
        data[i].words,
        data[i].timestampOfWord.end
      );
      pages.push({ page, sentences, sentenceEndTimes, audioUrl, duration });
    }

    return pages;
  } catch (error) {
    console.error(error);
  }
};

export default chapterInquiry;

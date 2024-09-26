import { getData } from "../repository/mongo";
import wordToSentence from "../utils/wordToSentence";

const pageInquiry = async (collectionName, page, db) => {
  try {
    console.log("Data retrieving...");
    const data = await getData(collectionName, { page: page }, db);

    const duration = data.duration;
    const audioUrl = data.audioUrl;
    const { sentences, sentenceEndTimes } = wordToSentence(
      data.words,
      data.timestampOfWord.end
    );

    return { sentences, sentenceEndTimes, audioUrl, duration };
  } catch (error) {
    console.error(error);
  }
};

export default pageInquiry;

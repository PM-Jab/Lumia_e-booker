import wordToSentence from "../utils/wordToSentence";

const buildSentenceWithTimestamp = (pages) => {
  const sentences = [];
  const sentenceEndTimes = [];
  const sentenceStartTimes = [];

  for (const page of pages) {
    const words = page.words;
    const wordEndTimes = page.timestampOfWord.end;
    const wordStartTimes = page.timestampOfWord.start;
    const {
      sentences: pageSentences,
      sentenceEndTimes: pageSentenceEndTimes,
      sentenceStartTimes: pageSentenceStartTimes,
    } = wordToSentence(words, wordEndTimes, wordStartTimes);
    sentences.push(pageSentences);
    sentenceEndTimes.push(pageSentenceEndTimes);
    sentenceStartTimes.push(pageSentenceStartTimes);
  }

  return { sentences, sentenceEndTimes, sentenceStartTimes };
};

export default buildSentenceWithTimestamp;

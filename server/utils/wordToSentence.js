const fs = require("fs");

const putSpace = (arrayWord) => {
  const words = [];
  for (const word of arrayWord) {
    if (!word.includes("\n\n") && !word.includes("\n")) {
      words.push(word + " ");
    } else {
      words.push(word);
    }
  }
};

const wordToSentence = (words, wordEndTimes, wordStartTimes) => {
  const sentences = [];
  const sentenceEndTimes = [];
  const sentenceStartTimes = []; //! not continue

  let currentSentence = "";
  let wordPerSentenceCount = 0;
  for (let i = 0; i < words.length; i++) {
    currentSentence += words[i] + " ";
    wordPerSentenceCount++;

    if (currentSentence.includes("\n\n")) {
      currentSentence = currentSentence.replace("\n\n ", "\n\n");
      sentences.push(currentSentence);
      sentenceEndTimes.push(wordEndTimes[i]);
      sentenceStartTimes.push(wordStartTimes[i]);

      currentSentence = "";
      wordPerSentenceCount = 0;
    }

    if (currentSentence.includes("\n")) {
      currentSentence = currentSentence.replace("\n ", "\n");
    }

    if (
      (words[i].includes(".") || words[i].includes(",")) &&
      wordPerSentenceCount > 3
    ) {
      sentences.push(currentSentence);
      sentenceEndTimes.push(wordEndTimes[i]);
      sentenceStartTimes.push(wordStartTimes[i]);
      currentSentence = "";
      wordPerSentenceCount = 0;
    }

    if (i == words.length - 1 && currentSentence != "") {
      // console.log("the last sentence: ", currentSentence);
      sentences.push(currentSentence);
      sentenceEndTimes.push(wordEndTimes[i]);
      sentenceStartTimes.push(wordStartTimes[i]);
      currentSentence = "";
      wordPerSentenceCount = 0;
    }
  }

  return { sentences, sentenceEndTimes, sentenceStartTimes };
};

export default wordToSentence;

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

const wordToSentence = (words, wordEndTimes) => {
  // const json_word = JSON.stringify(words);
  // fs.writeFileSync("words.txt", json_word);
  const sentences = [];
  const sentenceEndTimes = [];
  let currentSentence = "";
  let wordPerSentenceCount = 0;
  for (let i = 0; i < words.length; i++) {
    currentSentence += words[i] + " ";
    wordPerSentenceCount++;

    if (currentSentence.includes("\n\n")) {
      currentSentence = currentSentence.replace("\n\n ", "\n\n");
      sentences.push(currentSentence);
      sentenceEndTimes.push(wordEndTimes[i]);

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
      currentSentence = "";
      wordPerSentenceCount = 0;
    }

    if (i == words.length - 1 && currentSentence != "") {
      // console.log("the last sentence: ", currentSentence);
      sentences.push(currentSentence);
      sentenceEndTimes.push(wordEndTimes[i]);
      currentSentence = "";
      wordPerSentenceCount = 0;
    }
  }

  return { sentences, sentenceEndTimes };
};

export default wordToSentence;

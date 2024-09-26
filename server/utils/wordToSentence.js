const wordToSentence = (words, wordEndTimes) => {
  const sentences = [];
  const sentenceEndTimes = [];
  let currentSentence = "";
  for (let i = 0; i < words.length; i++) {
    currentSentence += words[i] + " ";
    if (currentSentence.includes("\n\n")) {
      currentSentence = currentSentence.replace("\n\n ", "\n\n");
    }

    if (words[i].includes(".") || words[i].includes(",")) {
      sentences.push(currentSentence);
      sentenceEndTimes.push(wordEndTimes[i]);
      currentSentence = "";
    }
  }

  return { sentences, sentenceEndTimes };
};

export default wordToSentence;

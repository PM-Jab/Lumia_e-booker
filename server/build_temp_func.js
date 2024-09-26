const SplitSegment = (page) => {
  const segments = page.split("\n\n");
  const result = segments.map((segment, index) => {
    if (index < segments.length - 1) {
      return segment + "\n\n";
    }
    return segment;
  });
  return result;
};

const SplitWords = (word) => {
  word = word.replace(/-\n/g, "");
  word = word.replace("—", " ");
  // console.log("word: ", word);
  const wordsWithSegmentBreaks = word.split(" ");
  // console.log("wordsWithSegmentBreaks: ", wordsWithSegmentBreaks);
  const words = [];
  wordsWithSegmentBreaks.reduce((acc, curr, index) => {
    if (curr !== "") {
      words.push(curr);
    }
    return acc;
  }, []);
  return words;
};

function splitByLinebreak(sentence) {
  const raw1 = sentence.replace(/-\n/g, " ");
  //   console.log("raw1", raw1);
  const raw2 = raw1.replace("—", " ");
  //   console.log("raw2", raw2);
  const raw3 = raw2.replace(".", "").replace(":", "").replace(",", "");
  return raw3.split("\n");
}

// function splitByLinebreak(sentence) {
//   const raw1 = sentence.replace(/-\n/g, " ");
//   //   console.log("raw1", raw1);
//   const raw2 = raw1.replace("—", " ");
//   //   console.log("raw2", raw2);
//   return raw2.split("\n");
// }

function splitByBlank(sentence) {
  return sentence.split(" ");
}

const ProcessWords = (page) => {
  const sentences = splitByLinebreak(page);
  const words = sentences.flatMap((sentence) => splitByBlank(sentence));
  const processedWords = SplitWords(words.join(" "));

  return processedWords;
};

const FilterSegmentBreak = (sentences) => {
  const segments = [];
  for (const sentence of sentences) {
    if (sentence !== "\n\n") {
      segments.push(sentence);
    }
  }
  return segments;
};

function filterStopPoints(arrSentenceWords) {
  const fileterElements = [
    ":",
    ";",
    ",",
    ".",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "<",
    ">",
    "!",
    "?",
    "’",
    "‘",
    "“",
    "”",
  ];
  const filtered = [];
  for (let word of arrSentenceWords) {
    if (word.includes("’")) {
      word = word.replace(/’/g, "'");
    }
    if (word !== "" && word !== " ") {
      const charArr = word.split("");
      let filteredWord = "";
      for (const char of charArr) {
        if (!fileterElements.includes(char)) {
          filteredWord += char;
        }
      }
      filtered.push(filteredWord);
    }
  }
  return filtered;
}

function joinSentence(arrWords) {
  return arrWords.join(" ");
}

function markStopPoints(sentence) {
  // Define punctuation and conjunctions to consider for splitting
  const punctuation = /[,;:.]/;
  const conjunctions = /\b(and|but|or|so|yet|however|who|which|that)\b/;
  const maxSegmentLength = 70; // Set maximum segment length
  const minSegmentLength = 10; // Set minimum segment length

  let segments = [];
  let currentSegment = "";
  let skipNextWord = false;

  // Split sentence into words
  let words = sentence.split(" ");

  words.forEach((word, index) => {
    // Check if the current word starts with a capital letter
    const isCapitalized = /^[A-Z]/.test(word);
    const isNextWordCapitalized =
      index < words.length - 1 && /^[A-Z]/.test(words[index + 1]);

    // If the current and next words are capitalized, don't split them
    if (isCapitalized && isNextWordCapitalized) {
      currentSegment += (currentSegment ? " " : "") + word;
      skipNextWord = true;
    } else if (skipNextWord) {
      currentSegment += " " + word;
      skipNextWord = false;
    } else if (currentSegment.length + word.length <= maxSegmentLength) {
      currentSegment += (currentSegment ? " " : "") + word;
    } else {
      segments.push(currentSegment + " ");
      currentSegment = word;
    }

    // Check for natural pause points
    if (
      punctuation.test(word) ||
      // conjunctions.test(word) ||
      index === words.length - 1
    ) {
      if (currentSegment.length >= minSegmentLength) {
        // Handle segments with only one or two words
        if (index !== words.length - 1) {
          if (currentSegment.split(" ").length <= 1 && segments.length > 0) {
            segments[segments.length - 1] += currentSegment + " ";
          } else {
            segments.push(currentSegment + " ");
          }
        } else {
          if (currentSegment.split(" ").length <= 1 && segments.length > 0) {
            segments[segments.length - 1] += currentSegment;
          } else {
            segments.push(currentSegment);
          }
        }
        currentSegment = "";
      }
    }
  });

  // Add any remaining segment
  if (currentSegment) {
    if (currentSegment.split(" ").length <= 1 && segments.length > 0) {
      segments[segments.length - 1] += currentSegment;
    } else {
      segments.push(currentSegment);
    }
  }

  return segments;
}

const GetArrLastWord = (arrSentenceWords) => {
  const lastWord = arrSentenceWords[arrSentenceWords.length - 1];
  return lastWord;
};

const ReadingPageFormatFactory = (segments) => {
  const finalSentences = [];
  const segmentsWithBreak = segments.join("").split(/(\n\n)/);
  for (const segment of segmentsWithBreak) {
    const markedSentences = markStopPoints(segment);
    markedSentences.length ? finalSentences.push(...markedSentences) : null;
  }
  return finalSentences;
};

const SplitFilteredWordFactory = (sentence) => {
  const linebreakSplittedSentence = joinSentence(splitByLinebreak(sentence));
  // console.log("linebreakSplittedSentence: ", linebreakSplittedSentence);
  const filteredWords = filterStopPoints(
    splitByBlank(linebreakSplittedSentence)
  );

  return filteredWords;
};

export {
  ReadingPageFormatFactory,
  SplitFilteredWordFactory,
  GetArrLastWord,
  FilterSegmentBreak,
  SplitSegment,
  SplitWords,
  ProcessWords,
  // splitByLinebreakV2,
};

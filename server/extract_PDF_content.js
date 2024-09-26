import { readPdfText, readPdfPages } from "pdf-text-reader";

let filePath =
  "./assets/image/The-Psychology-of-Money-PDF-Book-By-Morgan-Housel.pdf";
const chapter1 = "./assets/image/Money (1. No One's Crazy).pdf";

async function allText(url) {
  const pdfText = await readPdfText({ url: url });
  console.info(pdfText);
}

async function eachLine(url) {
  const pages = await readPdfPages({ url: url });
  pages.forEach((page) => console.log(page.lines));
}

function charAtLast(text) {
  for (let i = text.length; i > 0; i--) {
    if (text[i - 1] != "n" || text[i - 1] != "\\") {
      return text[i - 1];
    }
  }
  return "";
}

async function eachLineWithLimitCharacters(url) {
  const pages = await readPdfPages({ url: url });
  let pageIndex = 20;
  pages.forEach((page) => {
    console.log("Page: " + pageIndex++);
    page.lines.forEach((line, index) => {
      console.log(line);

      if (index === page.lines.length - 1) {
        console.log(
          "===================================================================\n\n"
        );
      }
    });

    if (page.lines.length === 0) {
      console.log("image\n\n");
    }
  });
}

async function eachLineWithNewLineAndMin(url, min) {
  const pages = await readPdfPages({ url: url });
  let pdfText = [];
  let apiLine = "";
  let allChars = 0;
  let allLine = 0;
  pages.forEach((page) => {
    page.lines.forEach((line) => {
      if (line != "") {
        apiLine = apiLine.concat(apiLine ? String(" " + line) : line);
      } else if (apiLine.length < min) {
        apiLine = apiLine.concat(apiLine ? String(" " + line) : line);
      } else {
        apiLine = apiLine.concat(" " + apiLine.length);
        allChars += apiLine.length;
        allLine++;
        pdfText.push(apiLine);
        apiLine = "";
      }
    });
  });
  console.log("Lines: " + allLine);
  console.log("Characters: " + allChars);
  console.log(pdfText);
}

async function divideByPageFormated(url) {
  const pages = await readPdfPages({ url: url });
  let pageChars = "";
  let pageStack = "";
  let apiCount = 0;
  let more1500 = 0;
  let more1000 = 0;
  let more800 = 0;
  let less800 = 0;
  let apiStack = [];

  pages.forEach((page) => {
    pageStack =
      "====================================================================";
    page.lines.forEach((line) => {
      if (line.length) {
        pageChars = pageChars.concat(line);

        if (pageChars.length > 800 && charAtLast(pageChars) === ".") {
          if (pageChars.length > 1500) {
            more1500++;
          } else if (pageChars.length > 1000) {
            more1000++;
          } else {
            more800++;
          }
          apiStack.push(pageChars);
          pageChars = pageChars.concat("\n\n---" + pageChars.length + "---");
          pageStack = pageStack.concat("\n" + pageChars + "\n");
          pageChars = "";
          apiCount++;
        } else {
          pageChars = pageChars.concat("\n");
        }
      }
    });

    if (pageChars.length) {
      if (pageStack.length) {
        console.log(pageStack);
      }
      apiStack.push(pageChars);
      console.log(pageChars);
      console.log("---" + pageChars.length + "---");
      pageChars = "";
      console.log(
        "====================================================================\n"
      );

      apiCount++;
      less800++;
    }
  });

  console.log("Summary");
  console.log("Total API count: " + apiCount);
  console.log("more than 1500 chars: " + more1500);
  console.log("more than 1000 chars: " + more1000);
  console.log("more than 800 chars: " + more800);
  console.log("less than 800 chars: " + less800);

  // api formatted
  const apiFormatted = transformAPIFormat(apiStack);
  console.log(apiFormatted);
}

function transformAPIFormat(textArr, filterAll) {
  let filteredArr = [];
  let counter = 0;
  const filterElements = [
    ".",
    ",",
    "'",
    '"',
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    ":",
    "“",
    "”",
  ];
  // Filter out elements from textArr that are present in filterElements

  if (filterAll) {
    textArr.forEach((text) => {
      let filtered = "";
      const split_blank = text.split(" ");

      split_blank.forEach((text) => {
        for (const t of text) {
          if (!filterElements.includes(t)) {
            if (t == "\n") {
              filtered = filtered.concat(" ");
            } else {
              filtered = filtered.concat(t);
            }
          }
        }
        filtered = filtered.concat(" ");
      });

      filtered = removeTrailingSpaces(filtered);
      counter += filtered.length;
      filteredArr.push(filtered);
    });
  } else {
    textArr.forEach((text) => {
      let filtered = "";
      const split_blank = text.split(" ");

      split_blank.forEach((text) => {
        for (const t of text) {
          if (t == "\n") {
            filtered = filtered.concat(" ");
          } else {
            filtered = filtered.concat(t);
          }
        }
        filtered = filtered.concat(" ");
      });

      filtered = removeTrailingSpaces(filtered);
      counter += filtered.length;
      filteredArr.push(filtered);
    });
  }

  console.log(counter);

  return filteredArr;
}

async function divideByPageApiFormated(url, filterAll, limitCharacter) {
  const pages = await readPdfPages({ url: url });
  let pageChars = "";
  let apiCount = 0;
  let apiStack = [];

  pages.forEach((page) => {
    page.lines.forEach((line) => {
      if (line.length) {
        pageChars = pageChars.concat(line);

        if (
          pageChars.length > 800 &&
          charAtLast(pageChars) === "." &&
          limitCharacter
        ) {
          apiStack.push(pageChars);
          pageChars = "";
          apiCount++;
        } else {
          pageChars = pageChars.concat("\n");
        }
      }
    });

    if (pageChars.length) {
      apiStack.push(pageChars);
      pageChars = "";

      apiCount++;
    }
  });

  console.log("Summary");
  console.log("Total API count: " + apiCount);

  // api formatted
  // all filter will affect quality of TTS because AI will not know when its need to leave a gap while speaking
  const apiFormatted = transformAPIFormat(apiStack, filterAll);
  console.log(apiFormatted);
}

function removeTrailingSpaces(text) {
  return text.trimEnd();
}

async function divideByPageUIWebFormated(url) {
  const pages = await readPdfPages({ url: url });
  let pageStacks = [];
  let pageChars = "";
  pages.forEach((page) => {
    page.lines.forEach((line) => {
      pageChars = pageChars.concat(line + "\n");
    });
    pageStacks.push(removeTrailingSpaces(pageChars));
    pageChars = "";
  });
  return pageStacks;
}

function divideByStoper(text) {
  let stack = "";
  const rawStack = text.split(/([.,]\s*)(?!\d)/).reduce((acc, curr, index) => {
    if (index % 2 === 0) {
      stack += curr;
    } else {
      stack += curr;
      if (stack.length > 50) {
        acc.push(stack);
        stack = "";
      }
    }
    return acc;
  }, []);
  console.log(rawStack);
  return rawStack;
}

function divideByContainer(text) {
  let container = "";
  let counter = 0;
  let isNotPassStoper = true;
  const stoper = ['"', "'", ".", ",", ":", "”", "]", "}", ")"];

  // seperate into segments
  const paragraphs = text.split(/(\n\n)/);

  // extract words from a segment
  let rawStack = paragraphs.reduce((acc, segment, index, array) => {
    // Split each segment by spaces but not the '\n\n'
    if (segment !== "\n\n") {
      // spilt segment to words
      const lines = segment.split(/(\.\n)/);
      const words = lines.flatMap((line) => line.split(" "));

      words.forEach((word, index, array) => {
        // check stoper
        isNotPassStoper =
          isNotPassStoper &&
          !word.split("").some((char) => stoper.includes(char));
        // console.log(word);
        // console.log(isNotPassStoper);
        // is should not pass stoper and container need to have at least 13 words
        if (isNotPassStoper && counter < 15 && word != ".\n") {
          container = container.concat(word + " ");
          counter++;
          // console.log(container);
          // console.log(counter);
        } else if (counter < 3 && acc[acc.length - 1]) {
          container =
            word != ".\n"
              ? container.concat(word + " ")
              : container.concat(word);
          acc[acc.length - 1] = acc[acc.length - 1].concat(container);
          container = "";
          counter = 0;
          isNotPassStoper = true;
        } else {
          container =
            word != ".\n"
              ? container.concat(word + " ")
              : container.concat(word);
          acc.push(container);
          container = "";
          counter = 0;
          isNotPassStoper = true;
        }

        if (index === array.length - 1 && counter > 0 && container[0] != " ") {
          if (counter < 5) {
            // concat container with the prev array
            // console.log("segment: ", segment);
            // console.log("container: ", container);
            // console.log("acc prev: ", acc[acc.length - 1]);
            if (acc[acc.length - 1] === undefined) {
              acc.push();
            } else {
              acc[acc.length - 1] = acc[acc.length - 1].concat(container);
            }
          } else {
            acc.push(container);
          }

          container = "";
          counter = 0;
          isNotPassStoper = true;
        }
      });
    } else {
      if (acc[acc.length - 1] && charAtLast(acc[acc.length - 1]))
        acc[acc.length - 1] = removeTrailingSpaces(acc[acc.length - 1]);
      acc.push("\n");
      acc.push("\n");
    }

    if (index === array.length - 1 && segment) {
      acc[acc.length - 1] = removeTrailingSpaces(acc[acc.length - 1]);
    }
    return acc;
  }, []);

  return rawStack;
}
let less4 = 0;
let max = 0;
let min = ["a", "b", "c", "d", "e", "f"];
let allSentences = 0;
let allWords = 0;
let i = 0;
function dashboardWords(sentences) {
  sentences.forEach((sentence) => {
    if (!["\n", "\n\n"].includes(sentence)) {
      const words = sentence.split(" ");
      const amount = words.length;
      if (amount < 4) {
        less4++;
      }
      if (max < amount) {
        max = amount;
        console.log("sentence: ", sentence);
        console.log("max page: ", i);
      }
      if (min.length > amount) {
        min = words;
        // console.log("sentence: ", sentence);
        // console.log("words: ", words);
        console.log("min page: ", i);
      }
      allSentences++;
      allWords += amount;
    }
  });
}

function splitSegment(page) {
  return page.split(/(\n\n)/);
}

function markStopPoints(sentence) {
  // Define punctuation and conjunctions to consider for splitting
  const punctuation = /[,;:.]/;
  const conjunctions = /\b(and|but|or|so|yet|however|who|which|that)\b/;
  const maxSegmentLength = 50; // Set maximum segment length
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
      conjunctions.test(word) ||
      index === words.length - 1
    ) {
      if (currentSegment.length >= minSegmentLength) {
        // Handle segments with only one or two words
        if (index !== words.length - 1) {
          if (currentSegment.split(" ").length <= 2 && segments.length > 0) {
            segments[segments.length - 1] += currentSegment + " ";
          } else {
            segments.push(currentSegment + " ");
          }
        } else {
          if (currentSegment.split(" ").length <= 2 && segments.length > 0) {
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
    if (currentSegment.split(" ").length <= 2 && segments.length > 0) {
      segments[segments.length - 1] += currentSegment;
    } else {
      segments.push(currentSegment);
    }
  }

  return segments;
}

const ReadingContainerAPIFactory = (page) => {
  const finalSentences = [];
  const segments = splitSegment(page);
  // console.log(segments);
  for (const segment of segments) {
    const markedSentences = markStopPoints(segment);
    markedSentences.length ? finalSentences.push(...markedSentences) : null;
    // console.log(markedSentences);
    // dashboardWords(markedSentences);
    // break;
  }
  return finalSentences;
};

eachLineWithLimitCharacters(chapter1);

export { divideByPageUIWebFormated, ReadingContainerAPIFactory };

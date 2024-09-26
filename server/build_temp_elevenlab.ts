import e from "express";

const fs = require("fs");

// Path to your .txt file containing JSON data

type elevenlab_with_timestamp = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

type AudioMetadata = {
  alignment: elevenlab_with_timestamp;
  normalized_alignment: elevenlab_with_timestamp;
};

const extractAudioResult = (filePath: string) => {
  return new Promise<AudioMetadata>((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err: Error, data: string) => {
      if (err) {
        console.error("Error reading the file:", err);
        reject(err);
        return;
      }

      try {
        const jsonData = JSON.parse(data);
        const alignment: elevenlab_with_timestamp = jsonData.alignment;
        const normalized_alignment: elevenlab_with_timestamp =
          jsonData.normalized_alignment;
        const audioResult: AudioMetadata = {
          alignment: alignment,
          normalized_alignment: normalized_alignment,
        };
        resolve(audioResult);
      } catch (parseErr) {
        console.error("Error parsing JSON data:", parseErr);
        reject(parseErr);
      }
    });
  });
};

const main = async () => {
  const audioResult = await extractAudioResult(
    "./assets/elevenlab/psychology_of_money/money_bill_oxley_page22.txt"
  );

  const words: string[] = [];
  const wordEndTimes: number[] = [];
  let currentWord = "";
  let sengmentBreakCount = 0;
  for (let i = 0; i < audioResult.alignment.characters.length; i++) {
    if (audioResult.alignment.characters[i] !== " ") {
      currentWord += audioResult.alignment.characters[i];
    } else {
      wordEndTimes.push(audioResult.alignment.character_end_times_seconds[i]);
      words.push(currentWord);
      currentWord = "";
    }

    if (audioResult.alignment.characters[i] === "\n") {
      sengmentBreakCount++;
    } else {
      sengmentBreakCount = 0;
    }

    if (sengmentBreakCount === 2) {
      wordEndTimes.push(audioResult.alignment.character_end_times_seconds[i]);
      words.push(currentWord);
      currentWord = "";
      sengmentBreakCount = 0;
    }

    if (i === audioResult.alignment.characters.length - 1) {
      wordEndTimes.push(audioResult.alignment.character_end_times_seconds[i]);
      words.push(currentWord);
    }
  }

  // build sentence
  const sentences: string[] = [];
  const sentenceEndTimes: number[] = [];
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

  console.log(words);
  console.log(wordEndTimes);

  console.log(sentences);
  console.log(sentenceEndTimes);
};

main();

export { extractAudioResult };
export type { AudioMetadata };

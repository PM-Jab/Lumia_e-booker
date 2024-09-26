import { type } from "os";

// Import the Bun's fs module
const fs = require("fs");

// Path to your .txt file containing JSON data
const filePath = "./mp3-test-transcript-result.txt";

type AudioResultWord = {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word: string;
};

type AudioResultParagraph = {
  sentences: any[];
  num_words: number;
  start: number;
  end: number;
};

type AudioMetadata = {
  paragraphs: AudioResultParagraph[];
  words: AudioResultWord[];
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
        console.log("data: ", data);
        const jsonData = JSON.parse(data);
        const paragraphs =
          jsonData.results.channels[0].alternatives[0].paragraphs.paragraphs;
        const words = jsonData.results.channels[0].alternatives[0].words;
        // console.log("words: ", words.length);
        // console.log("index 0: ", words[0]);
        // console.log("index 1: ", words[1]);
        // console.log("index 299: ", words[298]);
        // console.log(paragraphs[0]);
        // for (const paragraph of paragraphs) {
        // }
        // console.log(audioResult.text);
        // console.log(audioResult.start);
        // console.log(audioResult.end);
        const audioResult: AudioMetadata = {
          paragraphs: paragraphs,
          words: words,
        };
        resolve(audioResult);
      } catch (parseErr) {
        console.error("Error parsing JSON data:", parseErr);
        reject(parseErr);
      }
    });
  });
};
// extractAudioResult(filePath);
export { extractAudioResult };
export type { AudioMetadata };

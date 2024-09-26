import {
  ReadingPageFormatFactory,
  SplitFilteredWordFactory,
  GetArrLastWord,
  FilterSegmentBreak,
  SplitSegment,
  SplitWords,
  ProcessWords,
} from "./build_temp_func";
import { extractAudioResult, type AudioMetadata } from "./extract_audio_result";

type sentence = string[];
type pairDiffAudioText = { audio: string; text: string };
type sentenceMetadata = number[];
type segment = sentence[];

const page = `Let me tell you about a problem. It might make you feel better about what
you do with your money, and less judgmental about what other people do
with theirs.

People do some crazy things with money. But no one is crazy.

Here’s the thing: People from different generations, raised by different
parents who earned different incomes and held different values, in different
parts of the world, born into different economies, experiencing different job
markets with different incentives and different degrees of luck, learn very
different lessons.

Everyone has their own unique experience with how the world works. And
what you’ve experienced is more compelling than what you learn second-
hand. So all of us—you, me, everyone—go through life anchored to a set of
views about how money works that vary wildly from person to person. What
seems crazy to you might make sense to me.

The person who grew up in poverty thinks about risk and reward in ways the
child of a wealthy banker cannot fathom if he tried.

The person who grew up when inflation was high experienced something the
person who grew up with stable prices never had to.

The stock broker who lost everything during the Great Depression
experienced something the tech worker basking in the glory of the late 1990s
can’t imagine.

The Australian who hasn’t seen a recession in 30 years has experienced
something no American ever has.

On and on. The list of experiences is endless.

You know stuff about money that I don’t, and vice versa. You go through life
with different beliefs, goals, and forecasts, than I do. That’s not because one
of us is smarter than the other, or has better information. It’s because we’ve
had different lives shaped by different and equally persuasive experiences.`;

const addSegmentBreak = (sentences: string[]): string[] => {
  const newSentences: string[] = [];
  let curr = sentences[0];
  for (let i = 1; i < sentences.length; i++) {
    if (sentences[i] !== "\n\n") {
      newSentences.push(curr);
      curr = sentences[i];
    } else {
      curr += sentences[i];
      newSentences.push(curr);
      curr = sentences[i + 1];
      i++;
    }

    if (i === sentences.length - 1) {
      newSentences.push(curr);
    }
  }
  return newSentences;
};

const main = async () => {
  // sentence for page
  const segments = SplitSegment(page);
  // console.log("segments : ", segments);
  const processed = ProcessWords(page);
  console.log("processed amount: ", processed.length);
  // console.log("processed: ", processed);
  const sentences: string[] = ReadingPageFormatFactory(segments);
  // console.log("sentences: ", sentences);
  const segmentSentences: string[] = FilterSegmentBreak(sentences);
  // console.log("segmentsSentences: ", segmentSentences);

  // split sentence into words
  const arrayLastWord: string[] = [];
  for (const sentence of segmentSentences) {
    const arrSentenceWords = SplitFilteredWordFactory(sentence);
    // console.log("arrSentenceWords: ", arrSentenceWords);
    const lastWord = GetArrLastWord(arrSentenceWords);
    arrayLastWord.push(lastWord);
  }
  console.log("arrayLastWord: ", arrayLastWord);

  // get audio result words
  const audioResult: AudioMetadata = await extractAudioResult(
    "./assets/audio_result/acc/aac-test-transcript-result.txt"
  );
  const arrAudioWords = audioResult.words;
  console.log("arrAudioWords: ", arrAudioWords.length);

  // compare words : result defect some words missing
  const sentenceMetadata: sentenceMetadata = [];
  let wordCount: number = 0;

  // loop for find timestamp at last word in each sentence
  for (const lastWord of arrayLastWord) {
    for (; wordCount < arrAudioWords.length; ) {
      console.log("lastWord: ", lastWord);
      console.log(
        "arrAudioWords[wordCount].word: ",
        arrAudioWords[wordCount].word
      );
      if (lastWord === arrAudioWords[wordCount].word) {
        // if (sentences[j] === "\n\n") {
        //   sentenceMetadata.push(0);
        // }
        sentenceMetadata.push(arrAudioWords[wordCount].end);
        wordCount++;
        break;
      }
      wordCount++;
    }
  }

  const newSentences = addSegmentBreak(sentences);

  console.log(newSentences);
  console.log(sentenceMetadata);
};

main();

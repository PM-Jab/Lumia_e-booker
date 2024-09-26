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
type sentenceMetadata = number[];

// const page = `Let me tell you about a problem. It might make you feel better about what
// you do with your money, and less judgmental about what other people do
// with theirs.

// People do some crazy things with money. But no one is crazy.

// Here’s the thing: People from different generations, raised by different
// parents who earned different incomes and held different values, in different
// parts of the world, born into different economies, experiencing different job
// markets with different incentives and different degrees of luck, learn very
// different lessons.

// Everyone has their own unique experience with how the world works. And
// what you’ve experienced is more compelling than what you learn second-
// hand. So all of us—you, me, everyone—go through life anchored to a set of
// views about how money works that vary wildly from person to person. What
// seems crazy to you might make sense to me.

// The person who grew up in poverty thinks about risk and reward in ways the
// child of a wealthy banker cannot fathom if he tried.

// The person who grew up when inflation was high experienced something the
// person who grew up with stable prices never had to.

// The stock broker who lost everything during the Great Depression
// experienced something the tech worker basking in the glory of the late 1990s
// can’t imagine.

// The Australian who hasn’t seen a recession in 30 years has experienced
// something no American ever has.

// On and on. The list of experiences is endless.

// You know stuff about money that I don’t, and vice versa. You go through life
// with different beliefs, goals, and forecasts, than I do. That’s not because one
// of us is smarter than the other, or has better information. It’s because we’ve
// had different lives shaped by different and equally persuasive experiences.`;

const page = `Your personal experiences with money make up maybe 0.00000001% of
what’s happened in the world, but maybe 80% of how you think the world
works. So equally smart people can disagree about how and why recessions
happen, how you should invest your money, what you should prioritize, how
much risk you should take, and so on.
In his book on 1930s America, Frederick Lewis Allen wrote that the Great
Depression “marked millions of Americans—inwardly—for the rest of their
lives.” But there was a range of experiences. Twenty-five years later, as he
was running for president, John F. Kennedy was asked by a reporter what he
remembered from the Depression. He remarked:
 
I have no first-hand knowledge of the Depression. My family had one of the
great fortunes of the world and it was worth more than ever then. We had
bigger houses, more servants, we traveled more. About the only thing that I
saw directly was when my father hired some extra gardeners just to give them
a job so they could eat. I really did not learn about the Depression until I read
about it at Harvard.
 
This was a major point in the 1960 election. How, people thought, could
someone with no understanding of the biggest economic story of the last
generation be put in charge of the economy? It was, in many ways, overcome
only by JFK’s experience in World War II. That was the other most
widespread emotional experience of the previous generation, and something
his primary opponent, Hubert Humphrey, didn’t have.
The challenge for us is that no amount of studying or open-mindedness can
genuinely recreate the power of fear and uncertainty.
I can read about what it was like to lose everything during the Great
Depression. But I don’t have the emotional scars of those who actually
experienced it. And the person who lived through it can’t fathom why
someone like me could come across as complacent about things like owning
stocks. We see the world through a different lens.
`;

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
  const segments = SplitSegment(page);
  //   console.log("segments : ", segments);

  const sentences: string[] = ReadingPageFormatFactory(segments);
  //   console.log("sentences: ", sentences);

  const filterSentences: string[] = FilterSegmentBreak(sentences);
  //   console.log("filterSentences: ", filterSentences);

  const sentenceWordsArr: string[][] = [];
  for (const sentence of filterSentences) {
    const processed = ProcessWords(sentence);
    sentenceWordsArr.push(processed);
  }
  //   console.log("sentenceWordsArr: ", sentenceWordsArr);

  const audioResult: AudioMetadata = await extractAudioResult(
    "./assets/audio_result/mp3/mp3-test-transcript-result.txt"
  );
  //   console.log("audioResult: ", audioResult);

  let limitIndex = 0;
  let currentAudioIndex = 0;
  const errorIndex = 3;
  const result: any = [];
  let currentLastWord = "";
  let beforeLastWord = "";

  for (const words of sentenceWordsArr) {
    console.log(words);
    limitIndex = words.length;
    currentLastWord = words[words.length - 1].replace("’", "'");
    beforeLastWord = words[words.length - 2].replace("’", "'");
    // console.log(`currentLastWord: ${currentLastWord}`);

    for (
      let i: number =
        limitIndex > 3 ? currentAudioIndex + limitIndex - 3 : currentAudioIndex;
      i < audioResult.words.length &&
      i < currentAudioIndex + limitIndex + errorIndex;
      i++
    ) {
      console.log("Index At: ", i);
      console.log(
        `currentLastWord: ${currentLastWord} | audioResult: ${audioResult.words[i].word}`
      );
      if (
        audioResult.words[i].word === currentLastWord ||
        audioResult.words[i - 1].word === beforeLastWord
      ) {
        console.log(
          `FOUND:: currentLastWord: ${currentLastWord} | audioResult: ${audioResult.words[i].word}`
        );
        result.push(audioResult.words[i]);
        currentAudioIndex = i + 1;
        break;
      }
    }
    console.log("----------");
    // break;
  }

  const readingSentences = addSegmentBreak(sentences);

  let k = 0;
  const ends = [];
  for (const res of result) {
    // console.log(readingSentences[k]);
    // console.log(res.word);
    ends.push(res.end);
    // console.log("");
    // k++;
  }
  console.log(readingSentences);
  console.log(ends);
};

main();

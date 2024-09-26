import { extractAudioResult, type AudioMetadata } from "./extract_audio_result";

const page: string = `Let me tell you about a problem. It might make you feel better about what
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

const wordSplitter = (page: string): string[] => {
  page = page.replace(/—/g, "— ");
  page = page.replace(/-/g, "- ");
  page = page.replace(/\n/g, "\n ");
  page = page.replace(/\n \n /g, "\n\n ");

  return page.split(" ").filter((word) => word !== "" && word !== "\n");
};

const SplitSegment = (page: string) => {
  return page.split("\n\n");
};

const main = async () => {
  const audioResult: AudioMetadata = await extractAudioResult(
    "./audio_result_analysis_chapter1_page1.txt"
  );
  const sentences: string[] = [];
  const endTimes: number[] = [];
  const lastWordOfsentences: string[] = [];

  for (const paragraph of audioResult.paragraphs) {
    for (const sentence of paragraph.sentences) {
      sentences.push(sentence.text);
      endTimes.push(sentence.end);
      lastWordOfsentences.push(
        sentence.text
          .split(" ")
          .pop()
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      );
    }
  }

  console.log("lastWordOfsentences: ", lastWordOfsentences);

  console.log("endTimes: ", endTimes);
};

main();

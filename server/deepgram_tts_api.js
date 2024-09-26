import { createClient } from "@deepgram/sdk";
import { writeFile, readFileSync } from "fs";

import { configDotenv } from "dotenv";
import { error } from "console";
import e from "express";

configDotenv("./");
// STEP 1: Create a Deepgram client with your API key
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const text = [
  `Let me tell you about a problem. It might make you feel better about what
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
had different lives shaped by different and equally persuasive experiences.`,
  `Your personal experiences with money make up maybe 0.00000001% of
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
stocks. We see the world through a different lens.`,
];

const filterSentences = [
  "Let me tell you about a problem. ",
  "It might make you feel better about what\nyou do with your money, ",
  "and less judgmental about what other people do\nwith theirs.",
  "People do some crazy things with money. ",
  "But no one is crazy.",
  "Here’s the thing: ",
  "People from different generations, ",
  "raised by different\nparents who earned different incomes and held ",
  "different values, ",
  "in different\nparts of the world, ",
  "born into different economies, ",
  "experiencing different job\nmarkets with different incentives and ",
  "different degrees of luck, ",
  "learn very\ndifferent lessons.",
  "Everyone has their own unique experience with how the world works. ",
  "And\nwhat you’ve experienced is more compelling than what you learn second-\nhand. ",
  "So all of us—you, ",
  "me, everyone—go through life anchored to a set of\nviews about how money ",
  "works that vary wildly from person to person. ",
  "What\nseems crazy to you might make sense to me.",
  "The person who grew up in poverty thinks about risk and reward in ways ",
  "the\nchild of a wealthy banker cannot fathom if he tried.",
  "The person who grew up when inflation was high experienced something ",
  "the\nperson who grew up with stable prices never had to.",
  "The stock broker who lost everything during the Great Depression\nexperienced ",
  "something the tech worker basking in the glory of the late 1990s\ncan’t imagine.",
  "The Australian who hasn’t seen a recession in 30 years has ",
  "experienced\nsomething no American ever has.",
  "On and on. ",
  "The list of experiences is endless.",
  "You know stuff about money that I don’t, ",
  "and vice versa. ",
  "You go through life\nwith different beliefs, ",
  "goals, and forecasts, ",
  "than I do. ",
  "That’s not because one\nof us is smarter than the other, ",
  "or has better information. ",
  "It’s because we’ve\nhad different lives shaped by different and equally ",
  "persuasive experiences.",
];

function bufferToHexString(buffer) {
  return buffer.toString("hex");
}

const getAudio = async (text, chunk) => {
  const bookName = "money";
  const chapter = "no_one_is_crazy";
  const model = "aura-asteria-en";
  const encode = "mp3";
  const rate = 48000;
  // STEP 2: Make a request and configure the request with options (such as model choice, audio configuration, etc.)
  const response = await deepgram.speak.request(
    { text },
    {
      model: model,
      encoding: encode,
      // container: "none",
      // sample_rate: rate,
    }
  );
  // STEP 3: Get the audio stream and headers from the response
  const stream = await response.getStream();
  const headers = await response.getHeaders();

  let fileName =
    bookName + "_" + chapter + "_" + model + "_" + chunk + "_" + encode;
  if (stream) {
    // STEP 4: Convert the stream to an audio buffer
    const buffer = await getAudioBuffer(stream);

    // STEP 5: Write the audio buffer to a file
    writeFile(fileName + ".mp3", buffer, (err) => {
      if (err) {
        console.error("Error writing audio to file:", err);
      } else {
        console.log("Audio file written to output.wav");
      }
    });
  } else {
    console.error("Error generating audio:", stream);
  }

  if (headers) {
    console.log("Headers:", headers);
  }
};

// helper function to convert stream to audio buffer
const getAudioBuffer = async (response) => {
  const reader = response.getReader();
  const chunks = [];

  let totalUnit8Array = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalUnit8Array += value.length;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};

const transcribeFile = async (filePath) => {
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    // path to the audio file
    readFileSync(filePath),
    // STEP 3: Configure Deepgram options for audio analysis
    {
      model: "nova-2",
      smart_format: true,
    }
  );

  if (error) throw error;
  // STEP 4: Print the results
  const jsonData = tranformJSON(result);
  await writeJSON("./mp3-test-transcript-result-2.txt", jsonData);
};

const writeJSON = async (filePath, jsonData) => {
  writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error("Error writing to the file:", err);
      return;
    }
    console.log("JSON data has been written to the file successfully.");
  });
};

const tranformJSON = (data) => {
  const jsonData = JSON.stringify(data, null, 2);
  return jsonData;
};

transcribeFile("./money_no_one_is_crazy_aura-asteria-en_1.mp3");

// for (let i = 1; i < text.length; i++) {
//   await getAudio(text[i], i);
// }

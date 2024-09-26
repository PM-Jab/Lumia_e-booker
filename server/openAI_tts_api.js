import fs from "fs";
import { createClient } from "@deepgram/sdk";

import { configDotenv } from "dotenv";

configDotenv("./");

const text = [
  "Let me tell you about a problem.",
  "It might make you feel better about what\nyou do with your money, and less judgmental about what other people do\nwith theirs.",
  "People do some crazy things with money.",
  "But no one is crazy.",
  "Here’s the thing: People from different generations, raised by different\nparents who earned different incomes and held different values, in different\nparts of the world, born into different economies, experiencing different job\nmarkets with different incentives and different degrees of luck, learn very\ndifferent lessons.",
  "Everyone has their own unique experience with how the world works.",
  "And\nwhat you’ve experienced is more compelling than what you learn second-\nhand.",
  "So all of us—you, me, everyone—go through life anchored to a set of\nviews about how money works that vary wildly from person to person.",
  "What\nseems crazy to you might make sense to me.",
  "The person who grew up in poverty thinks about risk and reward in ways the\nchild of a wealthy banker cannot fathom if he tried.",
  "The person who grew up when inflation was high experienced something the\nperson who grew up with stable prices never had to.",
  "The stock broker who lost everything during the Great Depression\nexperienced something the tech worker basking in the glory of the late 1990s\ncan’t imagine.",
  "The Australian who hasn’t seen a recession in 30 years has experienced\nsomething no American ever has.",
  "On and on.",
  "The list of experiences is endless.",
  "You know stuff about money that I don’t, and vice versa.",
  "You go through life\nwith different beliefs, goals, and forecasts, than I do.",
  "That’s not because one\nof us is smarter than the other, or has better information.",
  "It’s because we’ve\nhad different lives shaped by different and equally persuasive experiences.",
];

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const deepgram = createClient(DEEPGRAM_API_KEY);

async function synthesizeAudio(text) {
  const response = await deepgram.speak.request(
    { text },
    {
      model: "aura-asteria-en",
      encoding: "mp3",
    }
  );

  const stream = await response.getStream();
  if (stream) {
    const buffer = await getAudioBuffer(stream);
    return buffer;
  } else {
    throw new Error("Error generating audio");
  }
}

const getAudioBuffer = async (response) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};

async function main() {
  const segments = text;

  // Create or truncate the output file
  const outputFile = fs.createWriteStream("test_chunk1.mp3");

  for (const segment of segments) {
    try {
      const audioData = await synthesizeAudio(segment);
      outputFile.write(audioData);
      console.log("Audio stream finished for segment:", segment);
    } catch (error) {
      console.error("Error synthesizing audio:", error);
    }
  }

  console.log("Audio file creation completed.");
}

main();

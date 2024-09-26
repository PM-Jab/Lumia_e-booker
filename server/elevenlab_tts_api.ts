import { ElevenLabsClient } from "elevenlabs";
import { createWriteStream } from "fs";
import { writeFile, readFileSync } from "fs";

import { v4 as uuid } from "uuid";

import { extractAudioResult } from "./extract_audio_result";

import axios from "axios";
import fs from "fs";
import * as base64 from "base-64";

import * as dotenv from "dotenv";

dotenv.config();

const ELEVENLABS_API_KEY_MASTER: string =
  "sk_45fd8218746082113acec0b1c6b830d178b4ab7b235c6157";
const ELEVENLABS_API_KEY: string[] = [
  "sk_0764f9f81e9d8a8c90c166c14d9a4878078624907eabd93c",
];

const api_key: Record<string, string> = {
  master: "sk_45fd8218746082113acec0b1c6b830d178b4ab7b235c6157",
  jamesolizz98: "sk_0764f9f81e9d8a8c90c166c14d9a4878078624907eabd93c",
  emma: "sk_ca64b80b44836e61c5a5b601594a84bda7c21e5de5d14adb",
  benjamin: "sk_fc849c1bbe6c25e4020db62b577b8e2782382b2e519fa3c4",
};

const voice_dict: Record<string, string> = {
  adam_stone: "NFG5qt843uXKj4pFvR7C",
  benjamin: "LruHrtVF6PSyGItzMNHS",
  bill_oxley: "T5cu6IU92Krx4mh43osx",
};

const voice_name = "bill_oxley";
const voice_id = voice_dict[voice_name];
const api_token = api_key["benjamin"];
const pageIndex = 35;

const adam_stone = "adam_stone";
const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/with-timestamps`;

const headers = {
  "Content-Type": "application/json",
  "xi-api-key": api_token,
};

const page = `loans over the last 20 years. There is not decades of accumulated experience
to even attempt to learn from. We’re winging it.

Same for index funds, which are less than 50 years old. And hedge funds,
which didn’t take off until the last 25 years. Even widespread use of
consumer debt—mortgages, credit cards, and car loans—did not take off until
after World War II, when the GI Bill made it easier for millions of Americans
to borrow.

Dogs were domesticated 10,000 years ago and still retain some behaviors of
their wild ancestors. Yet here we are, with between 20 and 50 years of
experience in the modern financial system, hoping to be perfectly acclimated.

For a topic that is so influenced by emotion versus fact, this is a problem.
And it helps explain why we don’t always do what we’re supposed to with
money.

We all do crazy stuff with money, because we’re all relatively new to this
game and what looks crazy to you might make sense to me. But no one is
crazy—we all make decisions based on our own unique experiences that
seem to make sense to us in a given moment.

Now let me tell you a story about how Bill Gates got rich.`;

const body = {
  text: page,
  model_id: "eleven_multilingual_v2",
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.75,
  },
};

const writeJSON = async (filePath: string, jsonData: any) => {
  writeFile(filePath, jsonData, (err: any) => {
    if (err) {
      console.error("Error writing to the file:", err);
      return;
    }
    console.log("JSON data has been written to the file successfully.");
  });
};

const tranformJSON = (data: any) => {
  const jsonData = JSON.stringify(data, null, 2);
  return jsonData;
};

const main = async () => {
  try {
    const response = await axios.post(url, body, { headers });

    if (response.status !== 200) {
      console.error("Error:", response);
      return;
    }

    const responseData = response.data;
    const audioBytes = base64.decode(responseData.audio_base64);
    fs.writeFileSync(
      `./assets/audio/psychology_of_money/money_${voice_name}_page${pageIndex}.mp3`,
      audioBytes,
      "binary"
    );
    const audioMetadata = {
      alignment: responseData.alignment,
      normalized_alignment: responseData.normalized_alignment,
    };

    const jsonData = tranformJSON(audioMetadata);
    await writeJSON(
      `./assets/elevenlab/psychology_of_money/money_${voice_name}_page${pageIndex}.txt`,
      jsonData
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

main();

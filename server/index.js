import express from "express";
import cors from "cors";
import pkg from "body-parser";

import { connectToDatabase } from "./repository/mongo.js";
import pageInquiry from "./service/pageInquiryService.js";
import chapterInquiry from "./service/chapterInquiryService.js";
import audioToBlob from "./utils/audioToBlobUtil.js";

const { json } = pkg;
const app = express();
const port = 3001;
app.use(cors());
app.use(json());

const db = await connectToDatabase();

// get a page of the book
app.get("/book/:name/page/:page/inquiry", async (req, res) => {
  try {
    console.log("get book page");
    const { name, page } = req.params;
    const voice = "bill-oxley";
    const collectionName = `${name}_${voice}`;
    const { sentences, sentenceEndTimes, audioUrl, duration } =
      await pageInquiry(collectionName, page, db);
    res.json({ sentences, sentenceEndTimes, audioUrl, duration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal error" });
  }
});

app.get("/book/:name/chapter/:chapter/inquiry", async (req, res) => {
  try {
    console.log("get book chapter");
    const { name, chapter } = req.params;
    const voice = "bill-oxley";
    const collectionName = `${name}_${voice}`;
    const pages = await chapterInquiry(collectionName, chapter, db);
    res.json(pages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal error" });
  }
});

app.post("/load/audio", async (req, res) => {
  try {
    console.log("load audio");
    const { audioUrl } = req.body;
    const response = await fetch(audioUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the content type of the audio file
    const contentType = response.headers.get("content-type");

    // Set the appropriate headers
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");

    // Stream the audio data to the response using a pipe
    const reader = response.body.getReader();

    res.writeHead(200);

    const streamToResponse = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          break;
        }
        res.write(Buffer.from(value));
      }
    };

    streamToResponse();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

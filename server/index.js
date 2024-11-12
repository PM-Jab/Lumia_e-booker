import express from "express";
import cors from "cors";
import pkg from "body-parser";

import { connectToDatabase, getData } from "./repository/mongo.js";
import pageInquiry from "./service/pageInquiryService.js";
import chapterInquiry from "./service/chapterInquiryService.js";
import chapterDetailInquiry from "./service/chapterDetailInquiry.js";
import audioToBlob from "./utils/audioToBlobUtil.js";
import buildSentenceWithTimestamp from "./service/buildSentenceWithTimestamp.js";

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

// v1
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

// v2
app.get("/book/:name/chapter/:chapter/detail", async (req, res) => {
  try {
    console.log("get book chapter");
    const { name, chapter } = req.params;
    const voice = "bill-oxley";
    const collectionName = `${name}_${voice}`;
    const chapterDetail = await chapterDetailInquiry(
      collectionName,
      chapter,
      db
    );
    res.json(chapterDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal error" });
  }
});

app.post("/load/audio", async (req, res) => {
  try {
    console.log("load audio");
    const { audioUrl } = req.body;
    console.log("body: ", req.body);
    console.log("audioUrl: ", audioUrl);
    const key = "jabr2worker";

    if (!audioUrl) {
      res.status(400).json({ error: "audioUrl is required" });
      return;
    }

    const response = await fetch(audioUrl, {
      method: "GET",
      headers: {
        "X-Custom-Auth-Key": `${key}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    // Get the content type of the audio file
    const contentType = response.headers.get("content-type");

    // Set the appropriate headers
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, HEAD, OPTIONS, PUT, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "X-Custom-Auth-Key, Range");

    // Stream the audio data to the response using a pipe
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(arrayBuffer));
        controller.close();
      },
    });

    const reader = readableStream.getReader();

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

app.post("/stream/audio", async (req, res) => {
  try {
    console.log("load audio");
    const { audioUrl } = req.body;
    const range = req.headers.range ? req.headers.range : "bytes=0-";
    console.log("body: ", req.body);
    console.log("audioUrl: ", audioUrl);
    console.log("range: ", range);

    const key = "jabr2worker";

    if (!audioUrl) {
      res.status(400).json({ error: "audioUrl is required" });
      return;
    }

    const response = await fetch(audioUrl, {
      method: "GET",
      headers: {
        "X-Custom-Auth-Key": `${key}`,
        Range: range,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    // Get the content type of the audio file
    const contentType = response.headers.get("content-type");

    // Set the appropriate headers
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, HEAD, OPTIONS, PUT, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "X-Custom-Auth-Key, Range");

    // Stream the audio data to the response using a pipe
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(arrayBuffer));
        controller.close();
      },
    });

    const reader = readableStream.getReader();

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

// v3
app.get("/book/:title/:chapter", async (req, res) => {
  try {
    const { title, chapter } = req.params;
    console.log("Title: ", title.replace(/-/g, " "));

    const book = await db
      .collection("books")
      .findOne({ title: title.replace(/-/g, " ") });
    console.log("Book: ", book?._id.toString());

    if (!book) {
      res.status(404).json({ error: "book not found" });
      return;
    }

    const pages = await getData(
      "pages",
      {
        bookId: book?._id.toString(),
        chapterNumber: Number(chapter),
      },
      db
    );

    if (!pages.length) {
      res.status(404).json({ error: "chapter not found" });
      return;
    }

    const { sentences, sentenceEndTimes, sentenceStartTimes } =
      buildSentenceWithTimestamp(pages);

    const firstWordStartTime = pages.map(
      (page) => page.metadata.firstWordStartTime
    );

    const lastWordEndTime = sentenceEndTimes.map(
      (time) => time[time.length - 1]
    );

    res.json({
      title: book.chapters[chapter - 1].title,
      audioUrl: book.chapters[chapter - 1].chapterAudioUrl,
      duration: book.chapters[chapter - 1].duration,
      total: book.chapters[chapter - 1].pageIds.length,
      sentences,
      firstWordStartTime,
      lastWordEndTime,
      sentenceEndTimes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

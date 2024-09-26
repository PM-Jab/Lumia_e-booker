import express from "express";
import cors from "cors";
import pkg from "body-parser";

import { connectToDatabase } from "./repository/mongo.js";
import pageInquiry from "./service/pageInquiryService.js";
import chapterInquiry from "./service/chapterInquiryService.js";

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

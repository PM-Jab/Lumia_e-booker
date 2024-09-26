import axios from "axios";
import audioToBlob from "../utils/audioToBlobUtil.js";

const audioInsertService = async (filePath, bookName, voice, chapter, page) => {
  const key = `${bookName}-${voice}-${chapter}-${page}`;
  const cloudflareWorkerURL = `https://r2-worker.testaudio.workers.dev/${key}`;
  const headers = {
    "X-Custom-Auth-Key": "jabr2worker",
  };

  try {
    const data = await audioToBlob(filePath);

    const response = await axios.put(cloudflareWorkerURL, data, {
      headers,
    });

    console.log("Uploaded successful: ", response.status, response.statusText);
    console.log("response data: ", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to upload audio: ", error);
    } else {
      console.error(error);
    }
  }
};

// await audioInsertService(
//   "../assets/audio/adam/money_adam_stone_page3.mp3",
//   "psychology_of_money",
//   "adam_stone",
//   "chapter1",
//   "page3"
// );

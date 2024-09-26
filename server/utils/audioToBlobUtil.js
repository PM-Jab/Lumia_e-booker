const fs = require("fs").promises;

async function audioToBlob(filePath) {
  try {
    const buffer = await fs.readFile(filePath);

    const blob = new Blob([buffer], { type: "audio/mpeg" }); // Create Blob (set correct MIME type)

    return blob;
  } catch (error) {
    throw new Error(`Failed to convert audio to Blob: ${error}`);
  }
}

// const localAudioUrl =
//   "../assets/audio/psychology_of_money/money_bill_oxley_page22.mp3";
// audioToBlob(localAudioUrl).then((blob) => {
//   if (blob) {
//     console.log(blob);
//   }
// });

export default audioToBlob;

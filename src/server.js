import express from "express";
import path from "path";
import { Readable } from "stream";
import { getStream, getTeeingStream, getTransformStream } from "./stream.js";
import { wait } from "../public/utils.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Creating a simple Readable Stream
app.get("/streaming", async (req, res) => {
  const stream = getStream();
  Readable.fromWeb(stream).pipe(res);
});

// Teeing or copying a stream
app.get("/teeing", async (req, res) => {
  const stream = getTeeingStream();
  const [debugStream, responseStream] = stream.tee();
  const reader = debugStream.getReader();

  reader.read().then(function pump(chunk) {
    const { done, value } = chunk;
    if (done) {
      console.log("DONE");
      return;
    }

    console.log("VALUE - ", value);
    reader.read().then(pump);
  });

  Readable.fromWeb(responseStream).pipe(res);
});

// Transforming a stream
app.get("/transforming", async (req, res) => {
  const stream = getTransformStream();
  const [originalStream, transformStream] = stream.tee();

  const transformedStream = transformStream.pipeThrough(
    new TransformStream({
      async start(controller) {
        await wait(600);
        controller.enqueue("\n");
        for (let i = 0; i < 100; i += 1) {
          if (i === 50) {
            controller.enqueue("TRANSFORMING");
          } else {
            controller.enqueue(".");
          }
          await wait(10);
        }
        controller.enqueue("\n");
      },
      async transform(chunk, controller) {
        await wait(30);
        controller.enqueue(chunk.map((i) => i + 32));
      },
      flush(controller) {
        controller.terminate();
      },
    }),
  );

  Readable.fromWeb(originalStream).pipe(res, { end: false });
  Readable.fromWeb(transformedStream).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

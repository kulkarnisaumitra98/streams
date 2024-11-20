import express from "express";
import path from "path";
import { Readable, Stream, Writable } from "stream";
import { getStream, getTeeingStream, getTransformStream } from "./stream.js";
import { wait } from "../public/utils.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Creating a simple Readable Stream
app.get("/streaming", (req, res) => {
  const stream = getStream();
  stream.pipeTo(Writable.toWeb(res));
});

// Teeing a stream
app.get("/teeing", (req, res) => {
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
  const [inputStream, tranformStream] = stream.tee();

  const nodeWritable = Writable.toWeb(res);
  await inputStream.pipeTo(nodeWritable, { preventClose: true });

  const lowerCaseTranformStream = new TransformStream({
    // Start
    start(controller) {
      controller.enqueue("\nOutput:- ");
    },
    // Transform
    async transform(chunk, controller) {
      await wait(30);
      if (chunk instanceof Uint8Array) {
        controller.enqueue(chunk.map((i) => i + 32));
      }
    },
    // Close
    flush(controller) {
      controller.terminate();
    },
  });

  const transformedStream = tranformStream.pipeThrough(lowerCaseTranformStream);
  await transformedStream.pipeTo(nodeWritable);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

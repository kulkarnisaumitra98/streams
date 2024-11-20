import { wait } from "../public/utils.js";
import { readFileSync } from "node:fs";

//controller.enqueue(readFileSync("./public/lorem.txt"));

export const getStream = () => {
  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 50; ++i) {
        controller.enqueue("Chunk " + i + "\n");
        await wait(100);
      }
      controller.close();
    },
  });
};

export const getTeeingStream = () => {
  const source = ["I\n", "AM\n", "BEING\n", "LOGGED ", "! ", "! ", "! \n"];
  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < source.length; i += 1) {
        await wait(100);
        controller.enqueue(source[i]);
      }
      controller.close();
    },
  });
};
//
export const getTransformStream = () => {
  return new ReadableStream({
    async start(controller) {
      controller.enqueue("Input:- ");
      for (let i = 65; i < 91; i += 1) {
        controller.enqueue(new Uint8Array([i]));
        await wait(30);
      }
      controller.close();
    },
  });
};

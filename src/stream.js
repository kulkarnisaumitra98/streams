import { wait } from "../public/utils.js";

export const getStream = () => {
  return new ReadableStream({
    async start(controller) {
      controller.enqueue("Loading");
      for (let i = 0; i < 100; i += 1) {
        await wait(20);
        controller.enqueue(".");
      }
      controller.enqueue("Done :)");
      controller.close();
    },
  });
};

export const getTeeingStream = () => {
  const chunks = ["I\n", "AM\n", "BEING\n", "COPIED ", "! ", "! ", "! \n"];
  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < chunks.length; i += 1) {
        await wait(100);
        controller.enqueue(chunks[i]);
      }
      controller.close();
    },
  });
};

export const getTransformStream = () => {
  return new ReadableStream({
    async start(controller) {
      for (let i = 65; i < 91; i += 1) {
        await wait(20);
        controller.enqueue(new Uint8Array([i]));
      }
      controller.close();
    },
  });
};

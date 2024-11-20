const decoder = new TextDecoder();

export const decodeText = (chunk) => decoder.decode(chunk);

export const wait = (time = 1000) =>
  new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, time);
  });

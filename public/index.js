import { decodeText, wait } from "./utils.js";

function main(id) {
  const div = document.getElementById("root");
  div.innerHTML = "";

  if (id === "process-image") {
    // Process image chunk by chunk on the client
    const image = document.createElement("img");
    image.style = "width: 95%";
    div.appendChild(image);
    fetch("./neocity_large_size.png").then(async (response) => {
      const stream = response.body;
      let chunks = [];
      for await (let chunk of stream) {
        await wait(5);
        chunks.push(chunk);
        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);
        image.src = url;
      }
    });
  } else {
    // Fetching streaming responses
    fetch(`http://localhost:3000/${id}`).then((response) => {
      const stream = response.body;
      const reader = stream.getReader();
      const div = document.getElementById("root");
      div.innerHTML = "";

      reader.read().then(function pump(chunk) {
        const { value, done } = chunk;
        if (done) {
          return;
        }
        const span = document.createElement("span");
        span.innerText = decodeText(value);
        div.appendChild(span);

        reader.read().then(pump);
      });
    });
  }
}

document.addEventListener("click", (e) => {
  console.log(e.target.tagName);
  if (e.target.tagName === "BUTTON") {
    main(e.target.id);
  }
});

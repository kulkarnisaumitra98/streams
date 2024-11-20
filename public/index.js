import { decodeText } from "./utils.js";

const SERVER_URL = "http://localhost:3000";

async function main(id) {
  const div = document.getElementById("root");
  div.innerHTML = "";

  if (id === "read-file") {
    fetch(`${SERVER_URL}/large-file.txt`).then(async (response) => {
      const stream = response.body;
      for await (const chunk of stream) {
        div.innerText = decodeText(chunk);
      }
      div.innerText = "DONE";
    });
  } else {
    // Fetching streaming responses
    fetch(`${SERVER_URL}/${id}`).then((response) => {
      const stream = response.body;

      const reader = stream.getReader();
      reader.read().then(function pump(chunk) {
        const { value, done } = chunk;
        console.log(chunk);
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
  if (e.target.tagName === "BUTTON") {
    main(e.target.id);
  }
});

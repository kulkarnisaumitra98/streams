const ws = new WebSocket("ws://localhost:8080");

ws.addEventListener("message", (msg) => {
  console.log("message", msg.data);
  if (msg.data === "reload") {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }
});

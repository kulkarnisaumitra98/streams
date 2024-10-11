import chokidar from "chokidar";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const watcher = chokidar.watch(".", {
  ignored: [
    "**/node_modules/**",
    /(^|[/\\])\../, // ignore dotfiles
  ],
  persistent: true,
  ignoreInitial: false,
  recursive: true,
});

let sendMessage = null;

wss.on("connection", function connection(ws) {
  sendMessage = () => {
    ws.send("reload");
  };
});

watcher.on("change", () => {
  if (sendMessage) {
    sendMessage();
  }
});

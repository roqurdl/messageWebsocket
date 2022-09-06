import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Put all your backend code here.
const Sockets = [];

wss.on("connection", (fSocket) => {
  Sockets.push(fSocket);
  fSocket["nickname"] = "Anon";
  fSocket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "New_message":
        Sockets.forEach((aSocket) =>
          aSocket.send(`${fSocket.nickname}: ${message.content}`)
        );
        break;
      case "nickname":
        fSocket["nickname"] = message.content;
        break;
      default:
    }
  });
});

server.listen(process.env.PORT, handleListen);

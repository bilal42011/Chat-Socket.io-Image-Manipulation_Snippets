import express from "express";
let app = express();
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import cors from "cors";

app.use(cors());

const storageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: storageEngine });

let port = 3001;

let server = http.createServer(app);

app.get("/test", (req, res) => {
  res.send("Test working");
});

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.json("Single File Uploaded");
});

app.post("/multipleUpload", upload.array("images"), (req, res) => {
  console.log(req.files);
  res.json("Mutliple Files Uploaded");
});

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("sent_message", ({ data }) => {
    console.log(data);
    socket.broadcast.emit("brodcast_message", { data });
  });
});

server.listen(port, "localhost", () => {
  console.log("Server is Listeneing at Port: " + port);
});

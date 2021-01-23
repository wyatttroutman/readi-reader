import express from "express";
import { resolve } from "path";
import { urlencoded, json } from "body-parser";
import EPub from "epub";

function createBookData(title, author, description, language, subject, path) {
  return { title, author, description, language, subject, path };
}
let books = [
  createBookData(
    "The Hunt For Red October",
    "Tom Clancy",
    "Sample description.",
    "en",
    "Military Sci-Fi",
    ""
  ),
  createBookData(
    "Clear and Present Danger",
    "Tom Clancy",
    "Sample description.",
    "en",
    "Military Sci-Fi",
    ""
  ),
  createBookData(
    "Red Sun Rising",
    "Tom Clancy",
    "Sample description.",
    "en",
    "Military Sci-Fi",
    ""
  ),
];

const server = express();
server.use(urlencoded({ extended: false }));
server.use(json());

const port = 5050;

server.post("/book", (req, res) => {
  console.log(req.body);
  const { title, author, publishDate, path } = req.body;
  const book = createBookData(title, author, publishDate, path);
  books = [book, ...books];

  res.json(book);
});

server.post("/book/path/:path", (req, res) => {
  // Decode path
  const resolvedPath = resolve(decodeURIComponent(req.params.path));

  // Get metadataimport EPub from 'epub'
  const epub = new EPub(resolvedPath);

  epub.on("end", function () {
    // epub is initialized now
    const metadata = epub.metadata;

    // Creaate book record
    const { title, creator, description, language, subject } = metadata;
    const book = createBookData(
      title,
      creator,
      description,
      language,
      subject,
      resolvedPath
    );

    // Save book
    books = [book, ...books];

    // Return book
    res.json(book);
  });
  epub.parse();
});

server.get("/book", (req, res) => {
  res.json(books);
});

server.get("/book/download/:path", (req, res) => {
  const resolvedPath = resolve(decodeURIComponent(req.params.path));
  res.download(resolvedPath);
  console.log("Downloaded " + resolvedPath);
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

export default server;

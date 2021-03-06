import express from "express";
import { resolve } from "path";
import { urlencoded, json } from "body-parser";
import EPub from "epub";
import db from "./database/database";
import {
  getBookByIdQuery,
  getBooksQuery,
  insertBookQuery,
  deleteBookByIdQuery,
} from "./database/queries/book";

const server = express();
server.use(urlencoded({ extended: false }));
server.use(json());

const port = 5050;

function createBookObject(
  title,
  author,
  description,
  language,
  subject,
  path,
  publishDate
) {
  return { title, author, description, language, subject, path, publishDate };
}
function createBookData(object) {
  return [
    object.title,
    object.author,
    object.description,
    object.language,
    object.subject,
    object.path,
    object.publishDate,
  ];
}

server.post("/book", (req, res) => {
  const {
    title,
    description,
    language,
    subject,
    author,
    publishDate,
    path,
  } = req.body;
  const bookObject = createBookObject(
    title,
    author,
    description,
    language,
    subject,
    path,
    publishDate
  );
  const bookData = createBookData(bookObject);

  // Save book
  db.run(insertBookQuery, bookData, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: bookData,
      id: this.lastID,
    });
  });

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
    const bookObject = createBookObject(
      title,
      creator,
      description,
      language,
      subject,
      resolvedPath,
      ""
    );
    const bookData = createBookData(bookObject);

    // Save book
    db.run(insertBookQuery, bookData, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: bookObject,
        id: this.lastID,
      });
    });
  });

  epub.parse();
});

server.delete("/book/:id", (req, res, next) => {
  var params = [req.params.id];
  db.run(deleteBookByIdQuery, params, (err, book) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: book,
    });
  });
});

server.get("/book", (req, res) => {
  var params = [];
  db.all(getBooksQuery, params, (err, books) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: books,
    });
  });
});

server.get("/book/:id", (req, res) => {
  var params = [req.params.id];
  db.get(getBookByIdQuery, params, (err, book) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: book,
    });
  });
});

server.get("/book/download/:path", (req, res) => {
  const resolvedPath = resolve(decodeURIComponent(req.params.path));
  res.download(resolvedPath);
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

export default server;

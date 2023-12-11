const { nanoid } = require("nanoid");
const books = [];

const saveBook = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
  }

  // Validasi properti readPage
  if (readPage > pageCount) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  const id = nanoid(); // Menggunakan nanoid untuk membuat ID unik
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return res.status(201).json({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });
};

const getAllBooks = (req, res) => {
  if (books.length === 0) {
    return res.status(200).json({
      status: "success",
      data: {
        books: [],
      },
    });
  }

  let filteredBooks = [...books];

  // Filter by name
  if (req.query.name) {
    const queryName = req.query.name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(queryName)
    );
  }

  // Filter by reading status
  if (req.query.reading !== undefined) {
    const isReading = req.query.reading === "1";
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  // Filter by finished status
  if (req.query.finished !== undefined) {
    const isFinished = req.query.finished === "1";
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished
    );
  }

  const simplifiedBooks = filteredBooks.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));

  return res.status(200).json({
    status: "success",
    data: {
      books: simplifiedBooks,
    },
  });
};

const getBookById = (req, res) => {
  const { bookId } = req.params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
  }

  return res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
};

const updateBook = (req, res) => {
  const { bookId } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
  }

  // Validasi properti name
  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
  }

  // Validasi properti readPage
  if (readPage > pageCount) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  return res.status(200).json({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
};

const deleteBook = (req, res) => {
  const { bookId } = req.params;
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
  }

  books.splice(bookIndex, 1);

  return res.status(200).json({
    status: "success",
    message: "Buku berhasil dihapus",
  });
};

module.exports = {
  saveBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};

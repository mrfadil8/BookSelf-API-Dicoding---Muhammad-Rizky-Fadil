const express = require("express");
const booksRoutes = require("./routes/books");

const app = express();
const PORT = 9000;

app.use(express.json());

app.use("/books", booksRoutes);

app.listen(PORT, () => {
  console.log("Server Running On Port", PORT);
});

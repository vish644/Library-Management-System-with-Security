import Book from "../models/Book.js";

// GET ALL BOOKS
export const getBooks = async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = {};

    // SEARCH BY TITLE OR AUTHOR
    if (search) {
      query.$or = [
        {
          title: { $regex: search, $options: "i" },
        },
        {
          author: { $regex: search, $options: "i" },
        },
      ];
    }

    // FILTER BY STATUS
    if (status) {
      query.status = status;
    }

    const books = await Book.find(query)
      .populate("borrowedBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD BOOK
export const addBook = async (req, res) => {
  try {
    const { title, author, publishedYear } = req.body;

    // VALIDATION
    if (!title || !author || !publishedYear) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const book = await Book.create({
      title,
      author,
      publishedYear,
    });

    res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE BOOK
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, author, publishedYear } = req.body;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    book.title = title || book.title;

    book.author = author || book.author;

    book.publishedYear = publishedYear || book.publishedYear;

    await book.save();

    res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE BOOK
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    await book.deleteOne();

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// BORROW / RETURN BOOK
export const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // BORROW BOOK
    if (book.status === "available") {
      book.status = "borrowed";

      book.borrowedBy = req.user.id;

      await book.save();

      return res.status(200).json({
        message: "Book borrowed successfully",
        book,
      });
    }

    // ONLY BORROWER CAN RETURN
    if (book.borrowedBy && book.borrowedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the borrower can return this book",
      });
    }

    // RETURN BOOK
    book.status = "available";

    book.borrowedBy = null;

    await book.save();

    return res.status(200).json({
      message: "Book returned successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

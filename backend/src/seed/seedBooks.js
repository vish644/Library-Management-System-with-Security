import mongoose from "mongoose";
import dotenv from "dotenv";

import Book from "../models/Book.js";

dotenv.config();

const books = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    publishedYear: 2018,
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    publishedYear: 2008,
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    publishedYear: 1999,
  },
];

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected");

    await Book.deleteMany();

    await Book.insertMany(books);

    console.log("Books Seeded Successfully");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedBooks();

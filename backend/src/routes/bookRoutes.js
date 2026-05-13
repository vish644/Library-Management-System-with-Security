import express from "express";

import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  updateBookStatus,
} from "../controllers/bookController.js";

import protect from "../middlewares/authMiddleware.js";

import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

// GET ALL BOOKS
router.get("/", protect, getBooks);

// ADD BOOK (ADMIN)
router.post("/", protect, authorizeRoles("admin"), addBook);

// UPDATE BOOK (ADMIN)
router.put("/:id", protect, authorizeRoles("admin"), updateBook);

// DELETE BOOK (ADMIN)
router.delete("/:id", protect, authorizeRoles("admin"), deleteBook);

// BORROW / RETURN BOOK
router.patch("/:id/status", protect, updateBookStatus);

export default router;

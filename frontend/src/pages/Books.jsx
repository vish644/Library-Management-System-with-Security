import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/useAuth.js";
import { toast } from "react-hot-toast";

const Books = () => {
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedYear: "",
  });

  // FETCH BOOKS
  const fetchBooks = useCallback(async (searchQuery, statusQuery) => {
    try {
      setLoading(true);

      const response = await API.get(
        `/books?search=${searchQuery}&status=${statusQuery}`,
      );

      setBooks(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  }, []);

  // LOAD BOOKS ON MOUNT AND WHEN FILTERS CHANGE
  useEffect(() => {
    const loadBooks = async () => {
      await fetchBooks(search, status);
    };

    loadBooks();
  }, [search, status, fetchBooks]);

  // BORROW / RETURN BOOK
  const handleBorrowReturn = async (id) => {
    try {
      await API.patch(`/books/${id}/status`);

      fetchBooks(search, status);

      toast.success("Action completed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  // HANDLE FORM CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      publishedYear: "",
    });

    setEditingBook(null);

    setShowForm(false);
  };

  // ADD / UPDATE BOOK
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBook) {
        await API.put(`/books/${editingBook._id}`, formData);
        toast.success("Book updated successfully!");
      } else {
        await API.post("/books", formData);
        toast.success("Book added successfully!");
      }

      fetchBooks(search, status);

      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  // DELETE BOOK
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this book?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/books/${id}`);

      fetchBooks(search, status);

      toast.success("Book deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // EDIT BOOK
  const handleEdit = (book) => {
    setEditingBook(book);

    setFormData({
      title: book.title,
      author: book.author,
      publishedYear: book.publishedYear,
    });

    setShowForm(true);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 p-4">
        {/* ADMIN BUTTON */}
        {user?.role === "admin" && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 transition duration-200 text-white px-5 py-3 rounded"
            >
              {showForm ? "Close Form" : "Add Book"}
            </button>
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">
              {editingBook ? "Edit Book" : "Add Book"}
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Book Title"
                value={formData.title}
                onChange={handleChange}
                className="border p-3 rounded"
                required
              />

              <input
                type="text"
                name="author"
                placeholder="Author"
                value={formData.author}
                onChange={handleChange}
                className="border p-3 rounded"
                required
              />

              <input
                type="number"
                name="publishedYear"
                placeholder="Published Year"
                value={formData.publishedYear}
                onChange={handleChange}
                className="border p-3 rounded"
                required
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition duration-200 text-white px-5 py-2 rounded"
              >
                {editingBook ? "Update Book" : "Add Book"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 transition duration-200 text-white px-5 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* SEARCH + FILTER */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded w-full md:w-1/2"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">All Status</option>

            <option value="available">Available</option>

            <option value="borrowed">Borrowed</option>
          </select>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {books.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-10 text-center">
                <h2 className="text-2xl font-bold mb-2">No Books Found</h2>

                <p className="text-gray-600">Try changing search or filters.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <div
                    key={book._id}
                    className="bg-white shadow-md rounded-lg p-5 border"
                  >
                    <h2 className="text-2xl font-bold mb-2">{book.title}</h2>

                    <p className="text-gray-700 mb-1">Author: {book.author}</p>

                    <p className="text-gray-700 mb-1">
                      Published: {book.publishedYear}
                    </p>

                    <p
                      className={`font-semibold mb-3 ${
                        book.status === "available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {book.status}
                    </p>

                    {book.borrowedBy && (
                      <p className="text-sm text-gray-500 mb-3">
                        Borrowed By: {book.borrowedBy.username}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {/* BORROW / RETURN */}
                      <button
                        onClick={() => handleBorrowReturn(book._id)}
                        className={`px-4 py-2 rounded text-white transition duration-200 ${
                          book.status === "available"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        {book.status === "available" ? "Borrow" : "Return"}
                      </button>

                      {/* ADMIN CONTROLS */}
                      {user?.role === "admin" && (
                        <>
                          <button
                            onClick={() => handleEdit(book)}
                            className="bg-green-600 hover:bg-green-700 transition duration-200 text-white px-4 py-2 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(book._id)}
                            className="bg-red-600 hover:bg-red-700 transition duration-200 text-white px-4 py-2 rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Books;

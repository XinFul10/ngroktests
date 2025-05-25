import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

const inputStyle = {
  flex: 2,
  padding: "0.5rem 1rem",
  borderRadius: 4,
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const buttonStyle = {
  flex: 1,
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
};

export default function Dashboard() {
  // States for books & form inputs
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [publisher, setPublisher] = useState("");

  // States for editing a book
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPublisher, setEditPublisher] = useState("");

  // Loading, errors & success messages
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const booksPerPage = 5;

  // Search term for filtering
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch all books from API
  const fetchBooks = () => {
    setLoading(true);
    axiosClient
      .get("/api/books")
      .then(({ data }) => {
        setBooks(data);
        setLoading(false);
        setCurrentPage(0); // reset page after fetching
      })
      .catch((err) => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  // Clear add form inputs
  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setCategory("");
    setPublisher("");
    setErrors(null);
  };

  // Clear edit form inputs and state
  const clearEditForm = () => {
    setEditId(null);
    setEditTitle("");
    setEditAuthor("");
    setEditCategory("");
    setEditPublisher("");
    setErrors(null);
  };

  // Validate fields (simple non-empty check)
  const validateFields = (t, a, c, p) => {
    const errs = {};
    if (!t.trim()) errs.title = ["Title is required."];
    if (!a.trim()) errs.author = ["Author is required."];
    if (!c.trim()) errs.category = ["Category is required."];
    if (!p.trim()) errs.publisher = ["Publisher is required."];
    return Object.keys(errs).length ? errs : null;
  };

  // Add new book
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    const validationErrors = validateFields(title, author, category, publisher);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    axiosClient
      .post("/api/books", { title, author, category, publisher })
      .then(() => {
        setSuccessMessage("Book added successfully!");
        clearForm();
        fetchBooks();
        setLoading(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  // Start editing a book
  const handleEdit = (book) => {
    setEditId(book.id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category);
    setEditPublisher(book.publisher);
    setErrors(null);
  };

  // Update edited book
  const handleUpdate = (e) => {
    e.preventDefault();
    setErrors(null);
    const validationErrors = validateFields(editTitle, editAuthor, editCategory, editPublisher);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    axiosClient
      .put(`/api/books/${editId}`, {
        title: editTitle,
        author: editAuthor,
        category: editCategory,
        publisher: editPublisher,
      })
      .then(() => {
        setSuccessMessage("Book updated successfully!");
        clearEditForm();
        fetchBooks();
        setLoading(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  // Delete a book
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    setLoading(true);
    axiosClient
      .delete(`/api/books/${id}`)
      .then(() => {
        setSuccessMessage("Book deleted successfully!");
        fetchBooks();
        setLoading(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // Filter books by searchTerm (title startsWith, case-insensitive)
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    currentPage * booksPerPage,
    currentPage * booksPerPage + booksPerPage
  );

  // If currentPage is out of bounds due to filtering, reset to 0
  useEffect(() => {
    if (currentPage > totalPages - 1) {
      setCurrentPage(0);
    }
  }, [filteredBooks, totalPages, currentPage]);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "2rem auto",
        padding: "1rem 2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>
        Books Dashboard
      </h1>

      {successMessage && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: 4,
            border: "1px solid #c3e6cb",
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Title (starts with)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem 1rem",
          marginBottom: "1.5rem",
          borderRadius: 4,
          border: "1px solid #ccc",
          fontSize: "1rem",
        }}
        disabled={loading}
      />

      {/* Add/Edit form */}
      <form
        onSubmit={editId ? handleUpdate : handleSubmit}
        style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}
      >
        <input
          value={editId ? editTitle : title}
          onChange={(e) => (editId ? setEditTitle(e.target.value) : setTitle(e.target.value))}
          placeholder="Title"
          required
          style={inputStyle}
          disabled={loading}
        />
        {errors?.title && (
          <div style={{ color: "red", fontSize: "0.8rem" }}>{errors.title[0]}</div>
        )}

        <input
          value={editId ? editAuthor : author}
          onChange={(e) => (editId ? setEditAuthor(e.target.value) : setAuthor(e.target.value))}
          placeholder="Author"
          required
          style={inputStyle}
          disabled={loading}
        />
        {errors?.author && (
          <div style={{ color: "red", fontSize: "0.8rem" }}>{errors.author[0]}</div>
        )}

        <input
          value={editId ? editCategory : category}
          onChange={(e) =>
            editId ? setEditCategory(e.target.value) : setCategory(e.target.value)
          }
          placeholder="Category"
          required
          style={inputStyle}
          disabled={loading}
        />
        {errors?.category && (
          <div style={{ color: "red", fontSize: "0.8rem" }}>{errors.category[0]}</div>
        )}

        <input
          value={editId ? editPublisher : publisher}
          onChange={(e) =>
            editId ? setEditPublisher(e.target.value) : setPublisher(e.target.value)
          }
          placeholder="Publisher"
          required
          style={inputStyle}
          disabled={loading}
        />
        {errors?.publisher && (
          <div style={{ color: "red", fontSize: "0.8rem" }}>{errors.publisher[0]}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            flex: 1,
            backgroundColor: loading ? "#9e9e9e" : "#4caf50",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {editId ? "Update" : "Add Book"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={clearEditForm}
            disabled={loading}
            style={{
              marginLeft: "0.5rem",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
              padding: "0.5rem 1rem",
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Non-field errors */}
      {errors &&
        !errors.title &&
        !errors.author &&
        !errors.category &&
        !errors.publisher && (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {Object.keys(errors).map((key) => (
              <p key={key} style={{ margin: 0 }}>
                {errors[key][0]}
              </p>
            ))}
          </div>
        )}

      {loading ? (
        <p style={{ textAlign: "center", fontStyle: "italic", color: "#777" }}>
          Loading books...
        </p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#4caf50", color: "white" }}>
                <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Title</th>
                <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Author</th>
                <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Category</th>
                <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Publisher</th>
                <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBooks.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ padding: "1rem", textAlign: "center", color: "#777" }}
                  >
                    No books found.
                  </td>
                </tr>
              )}

              {paginatedBooks.map((book) => (
                <tr
                  key={book.id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    backgroundColor: editId === book.id ? "#e8f5e9" : "white",
                  }}
                >
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    {editId === book.id ? (
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.3rem",
                          borderRadius: 4,
                          border: "1px solid #ccc",
                        }}
                      />
                    ) : (
                      book.title
                    )}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    {editId === book.id ? (
                      <input
                        value={editAuthor}
                        onChange={(e) => setEditAuthor(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.3rem",
                          borderRadius: 4,
                          border: "1px solid #ccc",
                        }}
                      />
                    ) : (
                      book.author
                    )}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    {editId === book.id ? (
                      <input
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.3rem",
                          borderRadius: 4,
                          border: "1px solid #ccc",
                        }}
                      />
                    ) : (
                      book.category
                    )}
                  </td>
                  <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                    {editId === book.id ? (
                      <input
                        value={editPublisher}
                        onChange={(e) => setEditPublisher(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.3rem",
                          borderRadius: 4,
                          border: "1px solid #ccc",
                        }}
                      />
                    ) : (
                      book.publisher
                    )}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {editId === book.id ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          disabled={loading}
                          style={{
                            marginRight: 8,
                            backgroundColor: "#4caf50",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            padding: "0.3rem 0.6rem",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={clearEditForm}
                          disabled={loading}
                          style={{
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            padding: "0.3rem 0.6rem",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(book)}
                          disabled={loading}
                          style={{
                            marginRight: 8,
                            backgroundColor: "#2196f3",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            padding: "0.3rem 0.6rem",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          disabled={loading}
                          style={{
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            padding: "0.3rem 0.6rem",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 4,
                  border: "1px solid #4caf50",
                  backgroundColor: currentPage === 0 ? "#e0e0e0" : "#4caf50",
                  color: currentPage === 0 ? "#9e9e9e" : "white",
                  cursor: currentPage === 0 ? "default" : "pointer",
                }}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: 4,
                    border: "1px solid #4caf50",
                    backgroundColor: currentPage === index ? "#4caf50" : "white",
                    color: currentPage === index ? "white" : "#4caf50",
                    cursor: "pointer",
                  }}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 4,
                  border: "1px solid #4caf50",
                  backgroundColor: currentPage === totalPages - 1 ? "#e0e0e0" : "#4caf50",
                  color: currentPage === totalPages - 1 ? "#9e9e9e" : "white",
                  cursor: currentPage === totalPages - 1 ? "default" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

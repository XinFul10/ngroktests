import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [publisher, setPublisher] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPublisher, setEditPublisher] = useState("");
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    setLoading(true);
    axiosClient.get("/api/books")
      .then(({ data }) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    axiosClient.post("/api/books", { title, author, category, publisher })
      .then(() => {
        setTitle("");
        setAuthor("");
        setCategory("");
        setPublisher("");
        fetchBooks();
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const handleEdit = (book) => {
    setEditId(book.id);
    setEditTitle(book.title || "");
    setEditAuthor(book.author || "");
    setEditCategory(book.category || "");
    setEditPublisher(book.publisher || "");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setErrors(null);
    axiosClient.put(`/api/books/${editId}`, { title: editTitle, author: editAuthor, category: editCategory, publisher: editPublisher })
      .then(() => {
        setEditId(null);
        setEditTitle("");
        setEditAuthor("");
        setEditCategory("");
        setEditPublisher("");
        fetchBooks();
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this book?")) {
      axiosClient.delete(`/api/books/${id}`)
        .then(() => fetchBooks())
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <div style={{
      maxWidth: 800,
      margin: "2rem auto",
      padding: "1rem 2rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f9f9f9",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>Books Dashboard</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
          style={{
            flex: 2,
            padding: "0.5rem 1rem",
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: "1rem"
          }}
        />
        <input
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Author"
          required
          style={{
            flex: 2,
            padding: "0.5rem 1rem",
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: "1rem"
          }}
        />
        <input
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="Category"
          required
          style={{
            flex: 2,
            padding: "0.5rem 1rem",
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: "1rem"
          }}
        />
        <input
          value={publisher}
          onChange={e => setPublisher(e.target.value)}
          placeholder="Publisher"
          required
          style={{
            flex: 2,
            padding: "0.5rem 1rem",
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: "1rem"
          }}
        />
        <button
          type="submit"
          style={{
            flex: 1,
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem"
          }}
        >
          Add Book
        </button>
      </form>

      {errors && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {Object.keys(errors).map(key => (
            <p key={key} style={{ margin: 0 }}>{errors[key][0]}</p>
          ))}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: "center", fontStyle: "italic", color: "#777" }}>Loading books...</p>
      ) : (
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
            {books.map(book => (
              <tr key={book.id} style={{ borderBottom: "1px solid #ddd", backgroundColor: editId === book.id ? "#e8f5e9" : "white" }}>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  {editId === book.id ? (
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      style={{ width: "100%", padding: "0.3rem", borderRadius: 4, border: "1px solid #ccc" }}
                    />
                  ) : (
                    book.title
                  )}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  {editId === book.id ? (
                    <input
                      value={editAuthor}
                      onChange={e => setEditAuthor(e.target.value)}
                      style={{ width: "100%", padding: "0.3rem", borderRadius: 4, border: "1px solid #ccc" }}
                    />
                  ) : (
                    book.author
                  )}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  {editId === book.id ? (
                    <input
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value)}
                      style={{ width: "100%", padding: "0.3rem", borderRadius: 4, border: "1px solid #ccc" }}
                    />
                  ) : (
                    book.category
                  )}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                  {editId === book.id ? (
                    <input
                      value={editPublisher}
                      onChange={e => setEditPublisher(e.target.value)}
                      style={{ width: "100%", padding: "0.3rem", borderRadius: 4, border: "1px solid #ccc" }}
                    />
                  ) : (
                    book.publisher
                  )}
                </td>
                <td style={{ padding: "0.5rem", border: "1px solid #ddd", textAlign: "center" }}>
                  {editId === book.id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        style={{
                          marginRight: 8,
                          padding: "0.3rem 0.6rem",
                          backgroundColor: "#2196f3",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer"
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        style={{
                          padding: "0.3rem 0.6rem",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer"
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(book)}
                        style={{
                          marginRight: 8,
                          padding: "0.3rem 0.6rem",
                          backgroundColor: "#ffc107",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        style={{
                          padding: "0.3rem 0.6rem",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "1rem", textAlign: "center", color: "#777" }}>
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

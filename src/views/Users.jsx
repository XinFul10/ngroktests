import { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {
  const { user } = useStateContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (e.g., fetching user data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (!user) {
    return <div>No user logged in.</div>;
  }

  return (
    <div style={{
      maxWidth: "350px",
      margin: "2rem auto",
      padding: "1.5rem",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#fafafa",
      textAlign: "center"
    }}>
      <h2 style={{ marginBottom: "1rem", color: "#333" }}>User Profile</h2>
      <img
        src={user.avatar || "https://i.pravatar.cc/150?img=3"}
        alt={`${user.name}'s avatar`}
        style={{ width: 100, height: 100, borderRadius: "50%", marginBottom: "1rem" }}
      />
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email || "No email provided"}</p>
    </div>
  );
}

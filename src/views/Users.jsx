import { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {
  const { user } = useStateContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (!user) {
    return <div>No user logged in.</div>;
  }

  // Generate avatar URL based on user name's first letter or initials
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.name
  )}&background=random&color=fff&size=150`;

  return (
    <div
      style={{
        maxWidth: "350px",
        margin: "2rem auto",
        padding: "1.5rem",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#fafafa",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "1rem", color: "#333" }}>User Profile</h2>
      <img
        src={avatarUrl}
        alt={`${user.name}'s avatar`}
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          marginBottom: "1rem",
        }}
      />
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email || "No email provided"}
      </p>
    </div>
  );
}

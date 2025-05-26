import { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";

const mockUsers = [
  { id: 1, name: "Admin", email: "admin123@gmail.com" },
  { id: 2, name: "Test", email: "test@gmail.com" },
  { id: 3, name: "Haha", email: "haha@gmail.com" },
];

export default function Users() {
  const { user } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addedFriends, setAddedFriends] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddFriend = (friendId) => {
    const friend = filteredUsers.find((f) => f.id === friendId);

    if (!addedFriends.includes(friendId)) {
      setAddedFriends([...addedFriends, friendId]);
      setSuccessMessage(`${friend.name} has been added as a friend!`);

      // Clear the message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) &&
      u.id !== user?.id
  );

  if (loading) return <div>Loading user profile...</div>;
  if (!user) return <div>No user logged in.</div>;

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.name
  )}&background=random&color=fff&size=150`;

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "2rem auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* User Profile */}
      <div
        style={{
          padding: "1.5rem",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          backgroundColor: "#fafafa",
          textAlign: "center",
          marginBottom: "2rem",
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

      {/* Search Friends */}
      <div
        style={{
          padding: "1rem",
          background: "#fffef8",
          borderRadius: "10px",
          boxShadow: "0 0 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "1rem", color: "#5a6b4f" }}>Add a Friend</h3>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            marginBottom: "1rem",
            fontSize: "14px",
          }}
        />

        {/* Success Message */}
        {successMessage && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "#e6ffed",
              color: "#2e7d32",
              fontSize: "14px",
              border: "1px solid #b2dfdb",
              textAlign: "center",
            }}
          >
            {successMessage}
          </div>
        )}

        {filteredUsers.length > 0 ? (
          filteredUsers.map((friend) => (
            <div
              key={friend.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
                padding: "0.5rem",
                borderBottom: "1px solid #eee",
              }}
            >
              <div>
                <strong>{friend.name}</strong>
                <div style={{ fontSize: "12px", color: "#777" }}>
                  {friend.email}
                </div>
              </div>
              <button
                onClick={() => handleAddFriend(friend.id)}
                disabled={addedFriends.includes(friend.id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: addedFriends.includes(friend.id)
                    ? "#ccc"
                    : "#4caf50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: addedFriends.includes(friend.id)
                    ? "not-allowed"
                    : "pointer",
                  fontSize: "12px",
                }}
              >
                {addedFriends.includes(friend.id) ? "Added" : "Add Friend"}
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: "#999" }}>No users found.</p>
        )}
      </div>
    </div>
  );
}

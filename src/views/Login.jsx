import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [popup, setPopup] = useState({ show: false, message: "", error: false });
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useStateContext();

  const showNotification = (message, error = false) => {
    setPopup({ show: true, message, error });
    setTimeout(() => setPopup({ show: false, message: "", error: false }), 3000);
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    // Simulate delay of 3 seconds for UX effect
    setTimeout(() => {
      axiosClient
        .post("/api/login", payload)
        .then(({ data }) => {
          setToken(data.token);
          setUser(data.user);
          showNotification("Logged in successfully!");
          setLoading(false);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            showNotification("Login failed: incorrect email or password.", true);
            console.log(response.data.errors);
          } else {
            showNotification("An error occurred, please try again.", true);
          }
          setLoading(false);
        });
    }, 3000);
  };

  return (
    <>
      <div
        className="login-signup-form animated fadeInDown"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div className="form">
          <form onSubmit={onSubmit}>
            <h1 className="title">Login to your Library Account</h1>
            <input ref={emailRef} type="email" placeholder="Email" />
            <input ref={passwordRef} type="password" placeholder="Password" />
            <button className="btn btn-block" disabled={loading}>
              {loading ? "Logging in..." : "Sign in"}
            </button>
            <p className="message">
              You don't have an account? <Link to="/signup">Create Account</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Success popup bottom-right */}
      {!popup.error && (
        <div className={`notification-popup ${popup.show ? "show" : ""}`}>
          {popup.message}
        </div>
      )}

      {/* Error popup centered with icon */}
      {popup.error && (
        <div className={`error-popup ${popup.show ? "show" : ""}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "8px", verticalAlign: "middle" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            width="20"
            height="20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          {popup.message}
        </div>
      )}
    </>
  );
}

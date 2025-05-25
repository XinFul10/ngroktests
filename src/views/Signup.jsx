import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const { setUser, setToken } = useStateContext();

  const [popup, setPopup] = useState({ show: false, message: "", error: false });
  const [loading, setLoading] = useState(false);

  const showNotification = (message, error = false) => {
    setPopup({ show: true, message, error });
    setTimeout(() => setPopup({ show: false, message: "", error: false }), 3000);
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;
    const passwordConfirmation = passwordConfirmationRef.current.value;
  
    // Local validations
    if (!email.includes(".")) {
      showNotification("Invalid email format. Email must have a dot", true);
      return;
    }
  
    if (password !== passwordConfirmation) {
      showNotification("Passwords do not match. Please check your password", true);
      return;
    }
  
    // Password requirements: minimum 8 characters, at least one symbol
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < 8 || !symbolRegex.test(password)) {
      showNotification("Password must be at least 8 characters and include at least one symbol (e.g. !, @, #)", true);
      return;
    }
  
    setLoading(true);
  
    const payload = {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    };
  
    setTimeout(() => {
      axiosClient
        .post("/api/signup", payload)
        .then(() => {
          showNotification("Account created successfully! Redirecting to login...");
          setLoading(false);
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            showNotification("Signup failed: please check your input.", true);
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
        }}
      >
        <div className="form">
          <form onSubmit={onSubmit}>
            <h1 className="title">Create your account</h1>
            <input ref={nameRef} placeholder="Full Name" />
            <input ref={emailRef} type="email" placeholder="Email" />
            <input ref={passwordRef} type="password" placeholder="Password" />
            <input ref={passwordConfirmationRef} type="password" placeholder="Confirm Password" />
            <button className="btn btn-block" disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </button>
            <p className="message">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Success popup */}
      {!popup.error && (
        <div className={`notification-popup ${popup.show ? "show" : ""}`}>
          {popup.message}
        </div>
      )}

      {/* Error popup */}
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

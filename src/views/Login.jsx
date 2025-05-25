import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [loading, setLoading] = useState(false);
    const [fadeClass, setFadeClass] = useState("");

    const { setUser, setToken } = useStateContext();

    useEffect(() => {
        setFadeClass("fade-in");
    }, []);

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        };

        axiosClient.post('/api/login', payload)
            .then(({ data }) => {
                setTimeout(() => {
                    setToken(data.token);
                    setUser(data.user);
                    setLoading(false);
                }, 1500); // Simulate delay
            })
            .catch(err => {
                setLoading(false);
                const response = err.response;
                if (response && response.status === 422) {
                    alert("Incorrect email or password. Please try again.");
                }
            });
    };

    const wrapperStyle = {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#f3f3f3",
    };

    const cardStyle = {
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "1rem",
        boxShadow: "0 0 20px rgba(0,0,0,0.15)",
        maxWidth: "400px",
        width: "100%",
        opacity: 0,
        transform: "translateY(-20px)",
        animation: `${fadeClass} 0.5s ease-out forwards`,
    };

    const titleStyle = {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
        textAlign: "center",
        color: "#5c4033",
    };

    const inputStyle = {
        width: "100%",
        padding: "0.75rem",
        marginBottom: "1rem",
        border: "1px solid #ccc",
        borderRadius: "0.5rem",
        fontSize: "1rem",
    };

    const buttonStyle = {
        width: "100%",
        padding: "0.75rem",
        backgroundColor: "#6b4f3b",
        color: "white",
        border: "none",
        borderRadius: "0.5rem",
        fontSize: "1rem",
        cursor: loading ? "default" : "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
    };

    const messageStyle = {
        marginTop: "1rem",
        textAlign: "center",
        fontSize: "0.9rem",
    };

    const linkStyle = {
        color: "#8d6e63",
        textDecoration: "underline",
        marginLeft: "0.25rem",
    };

    const spinnerStyle = {
        width: "14px",
        height: "14px",
        border: "2px solid #fff",
        borderTop: "2px solid transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    };

    return (
        <>
            <style>
                {`
                @keyframes fade-in {
                    0% {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                `}
            </style>

            <div style={wrapperStyle}>
                <div style={cardStyle}>
                    <h1 style={titleStyle}>Login to your Library Account</h1>
                    <form onSubmit={onSubmit}>
                        <input ref={emailRef} type="email" placeholder="Email" style={inputStyle} />
                        <input ref={passwordRef} type="password" placeholder="Password" style={inputStyle} />
                        <button type="submit" style={buttonStyle} disabled={loading}>
                            {loading && <span style={spinnerStyle}></span>}
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                        <p style={messageStyle}>
                            Don’t have an account?
                            <Link to="/signup" style={linkStyle}>Create Account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

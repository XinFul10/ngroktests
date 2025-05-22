import { Link } from "react-router-dom";
import { useRef } from "react"
import  axiosClient  from "../axios-client.js"
import { useStateContext } from "../contexts/ContextProvider.jsx"
import { useState } from "react";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errors, setErrors] = useState(null)
    const {setUser, setToken} = useStateContext()
    
    const onSubmit = (ev) => {
        ev.preventDefault()
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        axiosClient.post('/api/login', payload)
            .then (({data}) => {
                setToken(data.token)
                setUser(data.user)
            })
            .catch (err => {
                const response = err.response
                if (response && response.status === 422) {
                    console.log(response.data.errors);
                }
            })
    }


    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">
                        Login to your Library Account
                        </h1>
                    <input ref={emailRef} type="email" placeholder="Email"/>
                    <input ref={passwordRef} type="password" placeholder="Password"/>
                    <button className="btn btn-block">Sign in</button>
                    <p className="message">
                        You don't have an account? <Link to="/signup"> Create Account</Link>
                        </p>
                </form>
            </div>  
        </div>
    )
}
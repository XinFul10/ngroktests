import { Link } from "react-router-dom"
import { useRef } from "react"
import  axiosClient  from "../axios-client.js"
import { useStateContext } from "../contexts/ContextProvider.jsx"

export default function Signup() {
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmationRef = useRef()

    const {setUser, setToken} = useStateContext()

    const onSubmit = (ev) => {
        ev.preventDefault()
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value
        }
        console.log(payload);
        axiosClient.post('/api/signup', payload)
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
                    <h1 className="title">Create your account</h1>
                    <input ref={nameRef} placeholder="Full Name"/>
                    <input ref={emailRef} type="email" placeholder="Email"/>
                    <input ref={passwordRef} type="password" placeholder="Password"/>
                    <input ref={passwordConfirmationRef} type="password" placeholder="Confirm Password"/>
                    <button className="btn btn-block">Sign up</button>
                    <p className="message">
                        Already have an account?<Link to="/login"> Sign in</Link>
                        </p>
                </form>
            </div>  
        </div>
    )
}
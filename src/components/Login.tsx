import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './style.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            console.error("Error logging in with Google", error);
            setError(error.message);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (isSignup) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error: any) {
            console.error("Authentication error:", error);
            setError(error.message);
        }
    };

    return (
        <div className="App">
            <div className="login_container">
                <span className="heading">Taskify</span>

                <form className="login_form" onSubmit={handleEmailAuth}>
                    <input
                        type="email"
                        className="login_input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="login_input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login_btn">
                        {isSignup ? "Sign Up" : "Login"}
                    </button>
                </form>

                <button className="login_btn google_btn" onClick={signInWithGoogle}>
                    Sign in with Google
                </button>

                {error && <p className="error_msg">{error}</p>}

                <p className="toggle_text" onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? "Already have an account? " : "Don't have an account? "}
                    <span>{isSignup ? "Login" : "Sign Up"}</span>
                </p>
            </div>
        </div>
    );
};

export default Login;

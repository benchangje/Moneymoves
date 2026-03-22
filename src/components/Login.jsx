import { useState } from "react";
import { auth } from "./firebase";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "./useAuth";
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword, 
         GoogleAuthProvider,
         signInWithPopup } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export default function Login() {

    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //Sign up 
    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    //Sign in
    const handleSignIn = async () => {
        setErrorMessage('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                setErrorMessage("No account found with this email.");
            } else if (error.code === "auth/wrong-password") {
                setErrorMessage("Incorrect password.");
            } else if (error.code === "auth/invalid-email") {
                setErrorMessage("Invalid email format.");
            } else if (error.code === "auth/invalid-credential") {
                setErrorMessage("Invalid email or password.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        };
    };

    //Sign in with Google
    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-6 px-8 lg:p-8 lg:px-10">
                <h1 className="text-3xl font-semibold text-gray-900">Login</h1>
                <div className="mt-6 max-w-lg">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full bg-gray-200 rounded-2xl px-5 py-3 placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 text-gray-400 focus:text-gray-600 hover:bg-gray-300 mb-4"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full bg-gray-200 rounded-2xl px-5 py-3 placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:text-gray-600 hover:bg-gray-300 mb-4"
                    />
                </div>
                <div className="flex flex-row items-start gap-4 mb-4">
                    <button onClick={handleSignIn} className={`${(!email || !password) ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-5 py-3 rounded-2xl`}>
                        Sign In
                    </button>
                    <button onClick={handleGoogleSignIn} className="bg-white text-gray-600 font-medium px-5 py-3 flex items-center rounded-2xl shadow-[0_0_8px_rgba(0,0,0,0.08)] hover:shadow-xl hover:scale-101 transition-all duration-300 gap-2">
                        <FcGoogle className="h-6 w-6 shrink-0 mr-1"/>
                        Sign in with Google
                    </button>
                </div>
                {errorMessage &&
                    <div>
                        <p className="text-red-500 mb-4">{errorMessage}</p>
                    </div>
                }
                {user ? (
                    <div>
                        <p>Welcome, {user.email}!</p>
                    </div>
                    ) : (
                    <p>Please sign in or sign up to access your profile and create listings.</p>
                )}
            </div>
        </div>
    );
}
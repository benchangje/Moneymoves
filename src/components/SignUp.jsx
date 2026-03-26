import { useState, useEffect } from "react";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth } from "./useAuth";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
    };
    const isValidPasswordMinLength = (password) => {
        return password.length >= 6;
    };
    const isValidPasswordMaxLength = (password) => {
        return password.length <= 128;
    };
    const isValidPasswordConfig = (password) => {
        return /\d/.test(password) && /[!@#$%^&*]/.test(password);
    };
    const handleSignUp = async () => {
        setErrorMessage("");
        if (!isValidEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }
        if (!isValidPasswordMinLength(password)) {
            setErrorMessage("Password must be at least 6 characters long");
            return;
        }
        if (!isValidPasswordMaxLength(password)) {
            setErrorMessage("Password must be no more than 128 characters long");
            return;
        }
        if (!isValidPasswordConfig(password)) {
            setErrorMessage("Password must include a number and a special character");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(auth.currentUser, {
                url: window.location.origin + "/login",
                handleCodeInApp: true,
            });
        } catch (error) {
            console.error("Error signing up:", error);
            if (error.code === "auth/user-not-found") {
                setErrorMessage("No account found with this email.");
            } else if (error.code === "auth/wrong-password") {
                setErrorMessage("Incorrect password.");
            } else if (error.code === "auth/invalid-email") {
                setErrorMessage("Invalid email format.");
            } else if (error.code === "auth/invalid-credential") {
                setErrorMessage("Invalid email or password.");
            } else if (error.code === "auth/email-already-in-use") {
                setErrorMessage("An account with this email already exists.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        }
    };

    useEffect(() => {
        if (user) {
            // After sign-up, send users to the existing profile setup route
            navigate("/profile_setup");
        }
    }, [user, navigate]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="flex flex-col items-center max-w-7xl mx-auto p-6 px-8 lg:p-8 lg:px-10">
                <h1 className="text-3xl font-semibold text-gray-900 mb-3">Create an Account</h1>
                <div className="max-w-lg w-full mx-auto mt-6 bg-white p-6 pb-5 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.08)]">
                    <div className="relative hover:scale-101 transition-all duration-300 mt-1">
                        <Mail className="h-5 w-5 text-gray-400 top-3.5 left-4 absolute transform" />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full bg-gray-200 rounded-2xl pl-12 px-6 py-3 placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 text-gray-400 focus:text-gray-600 hover:bg-gray-300 mb-6"
                        />
                    </div>
                    <div className="relative hover:scale-101 transition-all duration-300">
                        <KeyRound className="h-5 w-5 text-gray-400 top-3.5 left-4 absolute transform" />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-gray-200 rounded-2xl pl-12 px-5 py-3 placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 text-gray-400 focus:text-gray-600 hover:bg-gray-300 mb-6"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    <button
                        onClick={handleSignUp}
                        disabled={!email || !password}
                        className={`${(!email || !password) ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} w-full bg-blue-500 rounded-2xl w-full text-white px-5 py-3  mb-2 rounded-2xl hover:scale-101 transition-all duration-300`}
                    >
                        Create Account
                    </button>

                    {errorMessage && (
                        <p className="text-red-500 mt-2 m-1">{errorMessage}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
        

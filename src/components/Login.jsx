import { useState, useEffect } from "react";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { auth } from "./firebase";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword, 
         GoogleAuthProvider,
         signInWithPopup } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export default function Login( { onLinkClick } ) {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user) {
            onLinkClick();
            navigate("/");
        }
    }, [user]);

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
            <div className="flex flex-col items-center max-w-7xl mx-auto p-6 px-8 lg:p-8 lg:px-10">
                <h1 className="text-3xl font-semibold text-gray-900 mb-3">Login</h1>
                <p className="text-base text-gray-600">Please sign in or sign up to access your profile and create listings.</p>
                <div className="max-w-lg w-full mx-auto mt-6 bg-white p-6 pb-5 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.08)]">
                    <div className="relative hover:scale-101 transition-all duration-300">
                        <Mail className="h-5 w-5 text-gray-400 top-3.5 left-4 absolute transform" />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full bg-gray-200 rounded-2xl pl-12 px-5 py-3 placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 text-gray-400 focus:text-gray-600 hover:bg-gray-300 mb-5"
                        />
                    </div>
                    <div className="relative hover:scale-101 transition-all duration-300">
                        <KeyRound className="h-5 w-5 text-gray-400 top-3.5 left-4 absolute transform" />
                        <input 
                            type={showPassword ? "password" : "text"} 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-gray-200 rounded-2xl pl-12 px-5 py-3 placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 text-gray-400 focus:text-gray-600 hover:bg-gray-300 mb-5"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    <div className="flex flex-col items-center gap-5 mb-3">
                        <button onClick={handleSignIn} className={`${(!email || !password) ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} w-full text-white px-5 py-3 rounded-2xl hover:scale-101 transition-all duration-300`}>
                            Sign In
                        </button>
                        <div className="w-full flex items-center gap-4">
                            <div className="flex-grow border-t-1 border-gray-400 opacity-60 h-px"></div>
                            <span className="text-gray-400 text-base pb-0.5">
                                or
                            </span>
                            <div className="flex-grow border-t-1 border-gray-400 opacity-60 h-px"></div>
                        </div>
                        <button onClick={handleGoogleSignIn} className="bg-white border-1 border-gray-300 text-gray-600 font-medium w-full py-3 flex flex-row justify-center rounded-2xl hover:bg-gray-100 hover:scale-101 transition-all duration-300 gap-2">
                            <FcGoogle className="h-6 w-6 shrink-0 mr-1"/>
                            <p className="text-medium">Sign in with Google</p>
                        </button>
                    </div>
                    {errorMessage &&
                        <div>
                            <p className="text-red-500">{errorMessage}</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
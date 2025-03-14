import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api/api"; // Adjusted to point to `api.ts`
import * as React from "react";

const LandingPage = () => {
    const [isOpened, setIsOpened] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [succ, setSucc] = useState("");
    const navigate = useNavigate();

    const openModal = () => setIsOpened(true);
    const closeModal = () => setIsOpened(false);

    const handleLogIn = () => {
        setIsLogin(true);
        setIsSignUp(false);
        setError("");
        setSucc("");
    };

    const handleSignUp = () => {
        setIsLogin(false);
        setIsSignUp(true);
        setError("");
        setSucc("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleLoginSubmit = async () => {
        const { email, password } = formData;
        if (!email || !password) {
            setError("All fields are required");
            return;
        }

        try {
            const response = await loginUser({ email, password });
            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));  // store full user object for easy access

            if (user.user_type === "ADMIN") {
                setSucc("Logged in successfully! Automatically redirecting you... ✨");
                setTimeout(() => navigate("/admin"), 3000);
            } else {
                setSucc("Logged in successfully! Automatically redirecting you... ✨");
                setTimeout(() => navigate("/home"), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Login failed");
        }
    };


    const handleSignUpSubmit = async () => {
        const { firstName, lastName, email, password } = formData;
        if (!firstName || !lastName || !email || !password) {
            setError("All fields are required");
            return;
        }

        try {
            await registerUser({
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                user_type: "USER" // Default to regular user unless you have a dropdown to select
            });

            setSucc("Registered successfully! Redirecting to login...");
            setTimeout(handleLogIn, 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="h-screen w-screen overflow-x-hidden">

            <div className="relative h-full bg-cover bg-center bg-no-repeat"
                 style={{ backgroundImage: "url('/bookloop.gif')"}}>

                {/* button at the bottom */}
                <div className="absolute bottom-3 flex flex-col w-full justify-center items-center ">
                    <button className="btn-primary-cr glow-brown mb-3"
                            onClick={openModal}>
                                Register / Login
                    </button>
                    <p className="italic text-cream-0"> Start or resume your magical journey with us! ✨</p>
                </div>
            </div>

            {/* Modal */}
            {isOpened && (
                <div className="fixed inset-0 bg-brown-0 flex flex-row items-center justify-center z-50 bg-opacity-50">
                    {/* text div */}
                    <div className="relative bg-white rounded-lg max-w-5xl shadow-lg flex flex-row items-center justify-between">

                        {/* conditional displays */}
                        {isLogin && (
                            <div className="flex flex-col p-8 w-full">
                                <h1 className="text-[26px] text-brown-0">Welcome back! 🧡</h1>
                                <p className="my-4 text-gray-600">We're glad to see you again. Ready to dive back in? 📚✨</p>

                                {/* Email Input */}
                                <div className="flex flex-col p-3 border border-gray-300 rounded-md mb-5 transition-all focus-within:border-[#8c7569]">
                                    <label htmlFor="email" className="text-xs uppercase font-semibold tracking-wide text-[#8c7569] transition-all">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Email"
                                        className="outline-none border-none pt-1 placeholder-gray-400 text-gray-600"
                                        onChange={handleChange}
                                    />

                                </div>

                                {/* Password Input */}
                                <div className="flex flex-col p-3 border border-gray-300 rounded-md mb-5 transition-all focus-within:border-[#8c7569]">
                                    <label htmlFor="password" className="text-xs uppercase font-semibold tracking-wide text-[#8c7569] transition-all">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        className="outline-none border-none pt-1 placeholder-gray-400 text-gray-600"
                                        onChange={handleChange}
                                    />
                                </div>

                                {succ ? (
                                    <p className="text-green-0">{succ}</p>
                                ) : error ? (
                                    <p className="text-red-500">{error}</p>
                                ) : null}

                                {/* Buttons */}
                                <div className="flex justify-between items-center">
                                    <button className="btn-primary-br px-5" onClick={closeModal}>Cancel</button>
                                    <button className="btn-primary-br px-7" onClick={handleLoginSubmit}>
                                        Login
                                    </button>
                                </div>

                                {/* Sign Up */}
                                <p className="mt-6 text-sm text-center">
                                    Don't have an account? <a onClick={handleSignUp} className="text-brown-0 glow-brown hover-text-glow transition-all duration-300 cursor-pointer">Sign up now!</a>
                                </p>
                            </div>
                        )}

                        {isSignUp && (
                            <div className="flex flex-col px-7 py-2 w-full">
                                <h1 className="text-[24px] font-normal text-brown-0">Ready to start your journey with us? ✨</h1>
                                <p className="my-4 text-gray-600 text-md">Be a part of the <em><b className="text-brown-0">bookloop</b></em> community today! 🧡</p>

                                {/* Name Input */}
                                <div className="flex flex-col p-3 border border-gray-300 rounded-md mb-5 transition-all focus-within:border-[#8c7569]">
                                    <label htmlFor="name" className="text-xs uppercase font-semibold tracking-wide text-[#8c7569] transition-all">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        placeholder="First Name"
                                        className="outline-none border-none pt-1 placeholder-gray-400 text-gray-600"
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Name Input */}
                                <div className="flex flex-col p-3 border border-gray-300 rounded-md mb-5 transition-all focus-within:border-[#8c7569]">
                                    <label htmlFor="name" className="text-xs uppercase font-semibold tracking-wide text-[#8c7569] transition-all">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        placeholder="Last Name"
                                        className="outline-none border-none pt-1 placeholder-gray-400 text-gray-600"
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="flex flex-col p-3 border border-gray-300 rounded-md mb-5 transition-all focus-within:border-[#8c7569]">
                                    <label htmlFor="email" className="text-xs uppercase font-semibold tracking-wide text-[#8c7569] transition-all">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Email"
                                        className="outline-none border-none pt-1 placeholder-gray-400 text-gray-600"
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="flex flex-col p-3 border border-gray-300 rounded-md mb-5 transition-all focus-within:border-[#8c7569]">
                                    <label htmlFor="password" className="text-xs uppercase font-semibold tracking-wide text-[#8c7569] transition-all">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        className="outline-none border-none pt-1 placeholder-gray-400 text-gray-600"
                                        onChange={handleChange}
                                    />
                                </div>

                                {succ ? (
                                    <p className="text-green-0">{succ}</p>
                                ) : error ? (
                                    <p className="text-red-500">{error}</p>
                                ) : null}

                                {/* Buttons */}
                                <div className="flex justify-between items-center">
                                    <button className="btn-primary-br px-5"
                                            onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button className="btn-primary-br px-7"
                                            onClick={handleSignUpSubmit}>
                                        Sign Up
                                    </button>
                                </div>

                                {/* Log In */}
                                <p className="mt-6 text-sm text-center">
                                    Already have an account? <a onClick={handleLogIn} className="text-brown-0 text-glow hover-text-glow transition-all duration-300 cursor-pointer">Click here to log in.</a>
                                </p>
                            </div>
                        )}

                        {/* Image div */}
                        <div className="relative h-full overflow-hidden p-0 rounded-r-lg">
                            <img src="/pics/1.png" alt="Image" className="h-full w-auto object-fill max-w-max" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
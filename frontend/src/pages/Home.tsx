import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
  };

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-screen">

            {/* Navigation Bar */}
            <nav className="absolute top-0 z-10 text-cream-0 py-2 px-8 flex flex-row items-center shadow-lg text-xl bg-brown-0 bg-opacity-50 w-full font-pd italic font-bold">
                <div className="w-1/3">
                    <img src="/logo.svg" alt="bookloop" className="h-14 w-14" />
                </div>

                <ul className="flex gap-5 w-full justify-center">
                    <li>
                        <NavLink
                            to="/home"
                            className={`hover-text-glow hover:text-xl ${location.pathname === "/home" ? "glow-brown" : ""}`}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="search"
                            className={`hover-text-glow hover:text-xl ${location.pathname === "/home/search" ? "glow-brown" : ""}`}
                        >
                            Search
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="donate"
                            className={`hover-text-glow hover:text-xl ${location.pathname === "/home/donate" ? "glow-brown" : ""}`}
                        >
                            Donate
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="shelf"
                            className={`hover-text-glow hover:text-xl ${location.pathname === "/home/shelf" ? "glow-brown" : ""}`}
                        >
                            Shelf
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="drop-off"
                            className={`hover-text-glow hover:text-xl ${location.pathname === "/home/drop-off" ? "glow-brown" : ""}`}
                        >
                            Drop-off
                        </NavLink>
                    </li>
                </ul>

                <div className="w-1/3 justify-items-end">
                    <div className="relative group">
                        <IoLogOutOutline
                            className="h-10 w-10 cursor-pointer"
                            onClick={() => {
                                handleLogout();
                                navigate("/");
                            }}
                        />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            Log out
                        </span>
                    </div>
                </div>

            </nav>

            {/* Main Content */}
            <main className="w-full h-full">
                <Outlet /> {/* Dynamic content changes here */}
            </main>

            {/* Footer */}
            {/*<footer className="absolute bottom-0 text-brown-0 text-center py-3 w-full bg-brown-0 bg-opacity-30">*/}
            {/*    (C) {new Date().getFullYear()} BookLoop. All rights reserved.*/}
            {/*</footer>*/}
        </div>
    );
};

export default Home;
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './pages/Search';
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import BookLoop from "./pages/bookLoop";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Donate from "./pages/Donate";
import DropOff from "./pages/DropOff";
import Shelf from "./pages/Shelf";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route path="/home" element={<Home />}>
                    <Route index element={<BookLoop />} />
                    <Route path="search" element={<Search />} />
                    <Route path="donate" element={<Donate />} />
                    <Route path="shelf" element={<Shelf />} />
                    <Route path="drop-off" element={<DropOff />} />
                </Route>

                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
};

export default App;

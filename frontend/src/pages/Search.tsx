import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useRef } from 'react';
import { Book } from "../types";
import {getBooks, fetchUserById, saveBook, requestBorrowBook} from "../api/api";
import { AxiosError } from 'axios';
import useCurrentUser from '../hooks/useCurrentUser';

// Only the supported genres
const genres = ["All", "Fantasy", "Mystery/Thriller", "Romance", "Adventure", "Historical", "Educational"];

const Search = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedGenre, setSelectedGenre] = useState<string>("All");
    const [books, setBooks] = useState<Book[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [activeBook, setActiveBook] = useState<Book | null>(null);
    const [bookOwner, setBookOwner] = useState<string>("Unknown Owner");
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const userJson = localStorage.getItem('user');
    const currentUser = userJson ? JSON.parse(userJson) : null;

    const fetchBooks = async (page = 1, search = "", genre = "All") => {
        try {
            const query = {
                page,
                limit: 6,
                search: search || undefined,
                genre: genre !== "All" ? genre : undefined  // Don't send genre if "All"
            };

            const response = await getBooks(query);
            setBooks(response.data.books);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    // Fetch books on page/genre/search change
    useEffect(() => {
        fetchBooks(currentPage, searchTerm, selectedGenre);
    }, [currentPage, searchTerm, selectedGenre]);

    useEffect(() => {
        const getBookOwner = async () => {
            if (activeBook?.owner_id) {
                try {
                    const userJson = localStorage.getItem('user');
                    const currentUser = userJson ? JSON.parse(userJson) : null;

                    const loggedInUserId = Number(currentUser?.user_id);
                    const bookOwnerId = Number(activeBook.owner_id);

                    console.log("Logged in (localStorage):", loggedInUserId);
                    console.log("Book Owner:", bookOwnerId);

                    if (loggedInUserId === bookOwnerId) {
                        setBookOwner("Me");
                    } else {
                        const response = await fetchUserById(bookOwnerId);
                        const owner = response.data;
                        setBookOwner(`${owner.first_name} ${owner.last_name}`);
                    }
                } catch (error) {
                    console.error("Error fetching book owner:", error);
                    setBookOwner("Unknown Owner");
                }
            }
        };

        getBookOwner();
    }, [activeBook, currentUser]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            fetchBooks(1, value, selectedGenre);
        }, 500);
    };

    const handleGenreChange = (genre: string) => {
        setSelectedGenre(genre);
        setCurrentPage(1);  // Reset page when changing genre
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleBorrowRequest = async (bookId: number | undefined) => {
        if (!currentUser?.user_id || !bookId) {
            console.error("Missing user or book ID");
            return;
        }

        try {
            await requestBorrowBook(bookId);
            alert("Borrow request sent! 📚");
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error requesting book:", axiosError.response?.data || error);
            alert("Failed to request book. ❌");
        }
    };


    return (
        <div className="relative h-[100vh] bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: "url('/search/bg.png')" }}>

            <Helmet>
                <title>bookloop | search</title>
            </Helmet>

            <div className="h-full mx-28 flex flex-col justify-center pt-24 pb-14 px-14 bg-cream-0 bg-opacity-80">

                {/* Search Bar & Genre Filter */}
                <div className="absolute top-24 flex gap-4">
                    <input
                        type="text"
                        placeholder="Type a book title, or an author..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full p-3 border border-brown-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-0 bg-transparent text-brown-0 placeholder-brown-0 placeholder-opacity-50"
                    />

                    <select
                        value={selectedGenre}
                        onChange={(e) => handleGenreChange(e.target.value)}
                        className="p-3 border border-brown-0 rounded-lg bg-transparent text-brown-0 cursor-pointer w-1/2"
                    >
                        {genres.map((genre) => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div key={book.book_id} className="flex flex-row items-center rounded-lg"
                             onClick={() => setActiveBook(book)}>
                            <img
                                src={book.cover_image}
                                alt={book.title}
                                className="w-44 object-cover rounded-md mb-3 shadow-2xl hover-glow-img cursor-pointer"
                            />
                            <div className="flex flex-col w-full justify-center items-center text-center">
                                <p className="text-sm uppercase text-brown-0 text-opacity-50 mb-5">{book.genre}</p>
                                <h3 className="text-2xl font-semibold text-brown-0 italic">{book.title}</h3>
                                <p className="text-md text-brown-0 mb-2">{book.author}</p>
                                <p className="text-xs text-brown-0 mb-4">Borrowed {book.borrowedCount} times</p>
                                <button className="btn-primary-br w-32 py-2 hover:glow-brown">Borrow</button>
                            </div>
                        </div>
                    ))}
                </div>

                {books.length === 0 && (
                    <p className="text-center text-brown-0 mt-6 italic">No books found. 💔 Please try a different search...</p>
                )}

                {activeBook && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 h-full w-full">
                        <div className="rounded-lg p-6 w-2/3 h-2/3 relative g-cover bg-center bg-no-repeat"
                             style={{ backgroundImage: "url('/search/modal-bg.png')" }}>

                            <button className="absolute top-3 right-4 text-brown-0 hover:glow-brown"
                                    onClick={() => setActiveBook(null)}>✖</button>

                            <div className="flex gap-6 text-brown-0">
                                <img src={activeBook.cover_image}
                                     alt={activeBook.title}
                                     className="h-96 object-cover rounded-md shadow-2xl"/>

                                <div>
                                    <h2 className="text-3xl font-bold">{activeBook.title}</h2>
                                    <p className="text-2xl mb-2">by {activeBook.author}</p>
                                    <p className="text-lg mb-2"><strong>Genre:</strong> {activeBook.genre}</p>
                                    <p className="text-lg mb-2"><strong>Publication Date:</strong> {new Date(activeBook.publication_date).toLocaleDateString()}</p>
                                    <p className="text-lg mb-4"><strong>Status:</strong> <span className="uppercase">{activeBook.status}</span></p>

                                    <h3 className="text-2xl font-semibold">Synopsis:</h3>
                                    <p className="text-xl w-2/3">{activeBook.synopsis}</p>

                                    <div className="mt-5">
                                        <h3 className="text-2xl font-bold">Request Details</h3>
                                        <p className="text-xl mb-2">Book Owned: <i className="hover:glow-brown cursor-pointer">
                                            {bookOwner}
                                        </i></p>
                                    </div>

                                    <div className="flex gap-6 text-md mt-5">
                                        {activeBook.status !== "Borrowed" && bookOwner !== "Me" && ( // ✅ Hide if borrowed or owned
                                            <button
                                                className="btn-primary-br w-36 py-2 px-4 hover:glow-brown"
                                                onClick={() => handleBorrowRequest(activeBook?.book_id)}
                                            >
                                                Borrow
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center items-center mt-6 space-x-4 absolute bottom-10">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'text-gray-600' : 'glow-brown btn-primary-br'}`}>↜</button>
                    <span className="text-lg font-medium">Page {currentPage} of {totalPages}</span>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'text-gray-600' : 'glow-brown btn-primary-br'}`}>↝</button>
                </div>
            </div>
        </div>
    );
};

export default Search;
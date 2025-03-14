import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Book } from "../types";
import { getBooksByOwner } from "../api/api";

const Shelf = () => {
    const [ownedBooks, setOwnedBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchOwnedBooks = async () => {
            const userJson = localStorage.getItem('user');
            const currentUser = userJson ? JSON.parse(userJson) : null;

            if (currentUser?.user_id) {
                try {
                    const response = await getBooksByOwner(currentUser.user_id);
                    console.log("Books response: ", response.data);  // Log to check structure
                    setOwnedBooks(response.data.books || []);        // Be defensive here
                } catch (error) {
                    console.error("Failed to fetch books for current user", error);
                    setOwnedBooks([]);  // Fallback in case of error
                }
            }
        };

        fetchOwnedBooks();
    }, []);

    return (
        <div className="relative h-[100vh] bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: "url('/search/bg.png')" }}>

            <Helmet>
                <title>bookloop | My Shelf</title>
            </Helmet>

            <div className="h-full mx-28 flex flex-col justify-center pt-24 pb-14 px-14 bg-cream-0 bg-opacity-80">

                <h1 className="text-4xl font-bold text-brown-0 mb-8">My Bookshelf 📚</h1>

                {/* Books Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {ownedBooks?.length > 0 ? (
                        ownedBooks.map((book) => (
                            <div key={book.book_id} className="flex flex-row items-center rounded-lg">
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
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-brown-0 mt-6 italic">
                            You have no books in your shelf yet. 📖
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Shelf;
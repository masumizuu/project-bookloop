import React, { useEffect, useState } from "react";
import { RiBookShelfFill } from "react-icons/ri";
import { FaAddressBook, FaHome } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Book } from "../../types";
import { getBooks } from "../../api/api";
import adminApi from "../../api/adminApi";

const AdminDashboard: React.FC = () => {
  const [isHome, setIsHome] = useState(true);
  const [isBooks, setIsBooks] = useState(false);
  const [isReq, setIsReq] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleNavClick = (tab: string) => setActiveTab(tab);

  const HomeToggle = () => {
    setIsHome(true);
    setIsBooks(false);
    setIsReq(false);
  };
  const BooksToggle = () => {
    setIsHome(false);
    setIsBooks(true);
    setIsReq(false);
  };
  const ReqToggle = () => {
    setIsHome(false);
    setIsBooks(false);
    setIsReq(true);
  };

  const fetchBooks = async (page = 1) => {
    try {
      const response = await getBooks({ page, limit: 4 });
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
  };
// NEW: openAddModal for a blank book with prefilled values similar to edit and a default genre from available genres
const openAddModal = () => {
    // Detect available genres from current books; if none, default to an empty string
    const availableGenres = Array.from(new Set(books.map((b) => b.genre)));
    const defaultGenre = availableGenres.length > 0 ? availableGenres[0] : "";

    const emptyBook: Book = {
        book_id: 0, // auto-incremented on the backend
        title: "",
        author: "",
        genre: defaultGenre,
        // Default to today's date for the date picker
        publication_date: new Date().toISOString().split("T")[0],
        cover_image: "", // This field will be handled by an upload input in the modal
        synopsis: "",
        owner_id: 1, // Adjust as necessary
        status: "Available",
        borrowedCount: 0,
    };
    setSelectedBook(emptyBook);
    setShowModal(true);
};

  const closeEditModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedBook) {
      setSelectedBook({ ...selectedBook, [e.target.name]: e.target.value });
    }
  };

  // Updated: handleSave decides if we are adding or editing
  const handleSave = async () => {
    if (selectedBook) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, cannot update book");
          alert("Unauthorized: Please log in again.");
          navigate("/login");
          return;
        }

        // If book_id is 0, we do a POST (add); otherwise, PUT (update)
        if (selectedBook.book_id === 0) {
          await adminApi.addBook(selectedBook, token);
        } else {
          await adminApi.updateBook(selectedBook.book_id, selectedBook, token);
        }

        closeEditModal();
        await fetchBooks(currentPage); // Refresh book list
      } catch (error) {
        console.error("Failed to save book:", error);
        alert("Failed to save book. Please check your permissions.");
      }
    }
  };

  const handleDelete = async (bookId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: Please log in again.");
        navigate("/");
        return;
      }

      await adminApi.deleteBook(bookId, token);
      fetchBooks(currentPage);
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Failed to delete book. Please try again later.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    navigate("/");
  };

  // syanen's changes
  const [borrowRequests, setBorrowRequests] = useState<any[]>([]);

    const fetchBorrowRequests = async () => {
        const token = localStorage.getItem("token"); // Retrieve admin token
        if (!token) {
            alert("Unauthorized: Please log in again.");
            return;
        }

        try {
            const response = await adminApi.getAllBorrowRequests(token);
            if (response && Array.isArray(response)) {
                setBorrowRequests(response); // ✅ Ensure it's a valid array
            } else {
                console.error("❌ Invalid borrow request data:", response);
                setBorrowRequests([]); // ✅ Default to an empty array if API fails
            }
        } catch (error) {
            console.error("❌ Error fetching borrow requests:", error);
            setBorrowRequests([]); // ✅ Avoid `undefined.map()`
        }
    };


    useEffect(() => {
        if (isReq) {
            fetchBorrowRequests();
        }
    }, [isReq]);

    const handleApproveRequest = async (bookId: number) => {
        const token = localStorage.getItem("token"); // Get admin token
        if (!token) {
            alert("Unauthorized: Please log in again.");
            return;
        }

        try {
            await adminApi.approveBorrowRequest(bookId, token); // Pass token as second argument
            alert("Borrow request approved!");
            fetchBorrowRequests(); // Refresh the list
        } catch (error) {
            console.error("Error approving borrow request:", error);
            alert("Failed to approve borrow request.");
        }
    };

    const handleDenyRequest = async (bookId: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Unauthorized: Please log in again.");
            return;
        }

        const denialReason = prompt("Enter reason for denial:");
        if (!denialReason) return;

        try {
            await adminApi.denyBorrowRequest(bookId, denialReason, token); // Pass token
            alert("Borrow request denied!");
            fetchBorrowRequests(); // Refresh the list
        } catch (error) {
            console.error("Error denying borrow request:", error);
            alert("Failed to deny borrow request.");
        }
    };


    return (
    <div className="bg-brown-0 min-h-screen flex items-center justify-center">
      <div className="bg-cream-0 flex-1 flex space-y-5 flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl h-full">
        {/* Navigation */}
        <div className="bg-brown-0 px-2 lg:px-4 py-2 lg:py-10 sm:rounded-xl flex lg:flex-col justify-between">
          <nav className="flex items-center flex-row space-x-2 lg:space-x-0 lg:flex-col lg:space-y-2">
            <a
              className={`text-white/50 p-4 inline-flex justify-center rounded-md hover:bg-darkBR-0 hover:text-white smooth-hover ${
                activeTab === "home" ? "bg-darkBR-0 text-white" : ""
              }`}
              href="#"
              onClick={() => {
                handleNavClick("home");
                HomeToggle();
              }}
            >
              <FaHome className="h-8 w-8" />
            </a>

            <a
              className={`text-white/50 p-4 inline-flex justify-center rounded-md hover:bg-darkBR-0 hover:text-white smooth-hover ${
                activeTab === "books" ? "bg-darkBR-0 text-white" : ""
              }`}
              href="#"
              onClick={() => {
                handleNavClick("books");
                BooksToggle();
              }}
            >
              <RiBookShelfFill className="h-8 w-8" />
            </a>
          </nav>

          <div className="flex items-center flex-row space-x-2 lg:space-x-0 lg:flex-col lg:space-y-2">
            <a
              className={`text-white/50 p-4 inline-flex justify-center rounded-md hover:bg-darkBR-0 hover:text-white smooth-hover ${
                activeTab === "requests" ? "bg-darkBR-0 text-white" : ""
              }`}
              href="#"
              onClick={() => {
                handleNavClick("requests");
                ReqToggle();
              }}
            >
              <FaAddressBook className="h-8 w-8" />
            </a>

            <a
              className="text-white/50 p-4 inline-flex justify-center rounded-md hover:bg-darkBR-0 hover:text-white smooth-hover"
              href="#"
              onClick={() => {
                handleLogout();
              }}
            >
              <RiLogoutCircleLine className="h-8 w-8" />
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-2 sm:px-0 h-full flex flex-col">
          <div className="flex justify-between items-center flex-grow">
            {isHome && (
              <div className="flex flex-col w-full h-full flex-grow">
                <h3 className="text-3xl font-extralight text-brown-0">Admin Dashboard</h3>

                <h4 className="text-xl font-extralight text-brown-0 text-center mt-12">
                  What would you like to do?
                </h4>

                <div className="grid grid-cols-2 w-full h-full flex-grow items-center justify-center">
                  <div
                    className="pb-2 px-4 pt-4 w-full h-full flex cursor-pointer"
                    onClick={() => {
                      handleNavClick("books");
                      BooksToggle();
                    }}
                  >
                    <label
                      className="flex flex-col justify-center items-center p-4 border-2 border-brown-0 cursor-pointer w-full h-full hover:bg-darkBR-0 hover:text-cream-0"
                      htmlFor="radio_1"
                    >
                      <span className="text-xs font-semibold uppercase font-pd">Add / Edit / Delete Books</span>
                      <span className="text-xl font-bold mt-2">Manage book inventory</span>
                    </label>
                  </div>

                  <div
                    className="pb-2 px-4 pt-4 w-full h-full flex cursor-pointer"
                    onClick={() => {
                      handleNavClick("requests");
                      ReqToggle();
                    }}
                  >
                    <label
                      className="flex flex-col justify-center items-center p-4 border-2 border-brown-0 cursor-pointer w-full h-full
                                        hover:bg-darkBR-0 hover:text-cream-0"
                      htmlFor="radio_2"
                    >
                      <span className="text-xs font-semibold uppercase font-pd">Approve / Deny Book Requests</span>
                      <span className="text-xl font-bold mt-2">View book requests</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {isBooks && (
              <div className="w-full flex flex-col">
                {/* Add Book Button */}
                <div className="flex justify-start mb-4">
                  <button
                    className="bg-green-600 text-black px-4 py-2 rounded font-bold"
                    onClick={openAddModal}
                  >
                    Add Book
                  </button>
                </div>

                <div className="flex flex-col">
                  <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-darkBR-0">
                          <thead className="bg-gray-100 dark:bg-brown-0">
                            <tr>
                              <th
                                scope="col"
                                className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                              >
                                Book Title
                              </th>
                              <th
                                scope="col"
                                className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                              >
                                Genre
                              </th>
                              <th
                                scope="col"
                                className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                              >
                                Author
                              </th>
                              <th scope="col" className="p-4">
                                <span className="sr-only">Edit</span>
                              </th>
                              <th scope="col" className="p-4">
                                <span className="sr-only">Delete</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 dark:bg-brown-0 dark:divide-darkBR-0">
                            {books.map((book) => (
                              <tr
                                key={book.book_id}
                                className="hover:bg-gray-100 dark:hover:bg-darkBR-0"
                              >
                                <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                  {book.title}
                                </td>
                                <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">
                                  {book.genre}
                                </td>
                                <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                  {book.author}
                                </td>
                                <td
                                  className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap"
                                  onClick={() => openEditModal(book)}
                                >
                                  <a href="#" className="text-yellow-0 hover:underline">
                                    Edit
                                  </a>
                                </td>
                                <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                                  <a
                                    href="#"
                                    className="text-red-600 hover:underline"
                                    onClick={() => handleDelete(book.book_id)}
                                  >
                                    Delete
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Pagination Placeholder (Optional) */}
                  <div className="mt-4">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                    <span className="mx-2">Page {currentPage} of {totalPages}</span>
                    <button
                      className="px-4 py-2 bg-gray-300 rounded"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>

                {showModal && selectedBook && (
                  <div className="py-12 bg-cream-0 bg-opacity-50 transition duration-150 ease-in-out z-10 fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
                    <div className="bg-white p-8 shadow-lg rounded w-1/2 h-1/2 overflow-y-auto">
                      <h1 className="text-xl font-bold mb-4">
                        {selectedBook.book_id === 0 ? "Add Book" : "Edit Book"}
                      </h1>

                      {/* Book ID - Read-only */}
                      <label className="block text-sm font-bold">Book ID</label>
                      <input
                        name="book_id"
                        value={selectedBook.book_id}
                        readOnly
                        className="w-full p-2 border rounded mb-4 bg-gray-100 cursor-not-allowed"
                      />

                      {/* Title */}
                      <label className="block text-sm font-bold">Title</label>
                      <input
                        name="title"
                        value={selectedBook.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mb-4"
                      />

                      {/* Author */}
                      <label className="block text-sm font-bold">Author</label>
                      <input
                        name="author"
                        value={selectedBook.author}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mb-4"
                      />

                      {/* Genre */}
                      <label className="block text-sm font-bold">Genre</label>
                      <input
                        name="genre"
                        value={selectedBook.genre || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mb-4"
                      />

                      {/* Publication Date */}
                      <label className="block text-sm font-bold">Publication Date</label>
                      <input
                        name="publication_date"
                        type="date"
                        value={selectedBook.publication_date || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mb-4"
                      />

                      {/* Cover Image URL */}
                      <label className="block text-sm font-bold">Cover Image URL</label>
                      <input
                        name="cover_image"
                        value={selectedBook.cover_image || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mb-4"
                      />

                      {/* Synopsis - Textarea */}
                      <label className="block text-sm font-bold">Synopsis</label>
                      <textarea
                        name="synopsis"
                        value={selectedBook.synopsis || ""}
                        onChange={(e) =>
                          selectedBook &&
                          setSelectedBook({ ...selectedBook, synopsis: e.target.value })
                        }
                        rows={4}
                        className="w-full p-2 border rounded mb-4"
                      ></textarea>

                      {/* Owner ID - Read-only */}
                      <label className="block text-sm font-bold">Owner ID</label>
                      <input
                        name="owner_id"
                        value={selectedBook.owner_id}
                        readOnly
                        className="w-full p-2 border rounded mb-4 bg-gray-100 cursor-not-allowed"
                      />

                      {/* Status */}
                      <label className="block text-sm font-bold">Status</label>
                      <select
                        name="status"
                        value={selectedBook.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mb-4"
                      >
                        <option value="Available">Available</option>
                        <option value="Borrowed">Borrowed</option>
                        <option value="Requested">Requested</option>
                      </select>

                      {/* Borrowed Count */}
                      <label className="block text-sm font-bold">Borrowed Count</label>
                      <input
                        name="borrowedCount"
                        type="number"
                        value={selectedBook.borrowedCount}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded mb-4"
                      />

                      {/* Buttons */}
                      <div className="flex justify-end space-x-3">
                        <button onClick={handleSave} className="bg-brown-0 text-white px-4 py-2 rounded">
                          Save
                        </button>
                        <button onClick={closeEditModal} className="bg-gray-300 px-4 py-2 rounded">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

              {isReq && (
                  <div className="w-full flex flex-col">
                      <h3 className="text-3xl font-extralight text-brown-0 mb-4">Manage Borrow Requests</h3>

                      <div className="overflow-x-auto shadow-md sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-darkBR-0">
                              <thead className="bg-gray-100 dark:bg-brown-0">
                              <tr>
                                  <th className="py-3 px-6 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                                      Book Title
                                  </th>
                                  <th className="py-3 px-6 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                                      Requested By
                                  </th>
                                  <th className="py-3 px-6 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                                      Status
                                  </th>
                                  <th className="p-4 text-xs font-medium text-left text-gray-700 uppercase dark:text-gray-400">
                                      Actions
                                  </th>
                              </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200 dark:bg-brown-0 dark:divide-darkBR-0">
                              {borrowRequests.map((request) => (
                                  <tr key={request.transaction_id} className="hover:bg-gray-100 dark:hover:bg-darkBR-0">
                                      <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                                          {request.Book.title}
                                      </td>
                                      <td className="py-4 px-6 text-sm font-medium text-gray-500 dark:text-white">
                                          {request.User.first_name} {request.User.last_name}
                                      </td>
                                      <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                                          {request.status}
                                      </td>
                                      <td className="py-4 px-6 text-sm font-medium flex gap-3">
                                          {request.status === "Requested" && (
                                              <>
                                                  <button
                                                      className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-75"
                                                      onClick={() => handleApproveRequest(request.book_id)}
                                                  >
                                                      Approve
                                                  </button>
                                                  <button
                                                      className="bg-red-600 text-white px-4 py-2 rounded hover:opacity-75"
                                                      onClick={() => handleDenyRequest(request.book_id)}
                                                  >
                                                      Deny
                                                  </button>
                                              </>
                                          )}
                                      </td>
                                  </tr>
                              ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

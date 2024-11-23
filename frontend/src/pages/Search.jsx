import React, { useState, useEffect } from "react";
import { API_URL } from "../constant";

const Search = () => {
  const [query, setQuery] = useState(""); // Search query
  const [data, setData] = useState([]);  // API se fetched data

  // API call function
  const fetchData = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setData([]); // Clear data if query is empty
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/data/SearchTitle?searchQuery=${searchQuery}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await response.json();
      if (result.success) {
        setData(result.data); // Update state with API data
      } else {
        setData([]); // No data found
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect for automatic API call on query change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(query); // Query change hone ke baad API call
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce); // Cleanup debounce timer
  }, [query]);

  // Download function
  const handleDownload = (fileUrl) => {
    const link = document.createElement("a"); // Create a link element
    link.href = fileUrl; // Set href to file URL
    link.setAttribute("download", ""); // Add download attribute
    document.body.appendChild(link); // Append link to body
    link.click(); // Trigger click
    link.remove(); // Remove link element after click
  };

  return (
    <div className="container mx-auto p-6">
      {/* Search Section */}
      <div className="flex items-center space-x-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files..."
          className="border rounded-lg px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            {/* Image */}
            <img
              src={item.dataFile}
              alt={item.title}
              className="w-full h-40 object-cover"
            />

            {/* Content */}
            <div className="p-4 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-800 truncate">
                {item.title}
              </h3>

              {/* View Details Button */}
              <button
                onClick={() => alert(`Viewing details for: ${item.title}`)}
                className="mt-3 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-full"
              >
                View Details
              </button>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(item.dataFile)}
                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Data Message */}
      {data.length === 0 && query.trim() && (
        <p className="text-center text-gray-500 mt-6 text-green-500">
          No results found. Try another search.
        </p>
      )}
    </div>
  );
};

export default Search;

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../../Utils/Hooks/useAxiosPublic";
import Swal from "sweetalert2";

export default function SearchBar({
  placeholder = "Search products or shops...",
}) {
  const baseUrl = import.meta.env.VITE_BASEURL;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ref = useRef();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const getImages = (images) => {
    return images.filter((img) => {
      const lower = img.toLowerCase();
      return !(
        lower.endsWith(".mp4") ||
        lower.endsWith(".webm") ||
        lower.endsWith(".mov")
      );
    });
  };

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with TanStack Query
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const res = await axiosPublic.get(`/search?query=${debouncedQuery}`);
      return res.data;
    },
    enabled: !!debouncedQuery,
  });

  const handleSearch = () => {
    if (query.trim() === "") {
      return Swal.fire({
        icon: "warning",
        title: "Please enter a search term.",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: "top",
      });
    }

    navigate(`/categories/${"All Products"}?product=${query}`);
    setShowSuggestions(false);
  };

  const handleSelect = (item) => {
    if (item.type === "product") {
      // Encode the product ID for URL

      // Navigate to the category page and pass product ID
      navigate(
        `/categories/${encodeURIComponent(
          item?.category || "All Products",
        )}?product=${encodeURIComponent(
          item.title,
        )}&subcategory=${encodeURIComponent(
          item?.subcategory,
        )}&subcategory_item=${encodeURIComponent(item?.subcategory_item)}`,
      );
    }
    if (item.type === "shop")
      navigate(`/seller-page/${item.title}/store?id=${btoa(item.id)}`);
    setQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="w-full relative" ref={ref}>
      <div className="relative">
        <Search
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          onClick={handleSearch}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        />
      </div>

      {showSuggestions && query && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded-md max-h-64 overflow-y-auto shadow-lg">
          {isLoading && <li className="px-4 py-2 text-gray-500">Loading...</li>}
          {!isLoading && suggestions.length === 0 && (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          )}
          {!isLoading &&
            suggestions.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 cursor-pointer hover:bg-pink-50"
              >
                {item.type === "product" ? (
                  <div className="flex items-center gap-1.5">
                    <img
                      className="h-10 w-10  rounded"
                      src={`${baseUrl}${getImages(item.images)[0]}`}
                      alt={item.title}
                    />
                    <span>{item.title}</span>
                  </div>
                ) : (
                  `Shop: ${item.title}`
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

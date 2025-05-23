import { useState } from "react";
import { useLocation } from "wouter";

const SearchBox = () => {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery) return;
    
    // Build search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (searchDate) params.append("date", searchDate);
    
    // Determine which page to search based on query content
    const searchTerm = searchQuery.toLowerCase();
    
    if (searchTerm.includes("event") || searchTerm.includes("festival") || searchTerm.includes("concert")) {
      setLocation(`/events?${params.toString()}`);
    } else if (searchTerm.includes("cabin") || searchTerm.includes("stay") || searchTerm.includes("lodging")) {
      setLocation(`/cabins?${params.toString()}`);
    } else if (searchTerm.includes("attraction") || searchTerm.includes("visit") || searchTerm.includes("see")) {
      setLocation(`/attractions?${params.toString()}`);
    } else {
      // Default to searching destinations instead of a general search page
      setLocation(`/destinations?${params.toString()}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end md:justify-center gap-3">
        <div className="flex flex-col flex-grow">
          <label htmlFor="search-query" className="text-sm font-medium text-neutral-800 mb-1 text-left">I'm looking for</label>
          <input 
            type="text" 
            id="search-query" 
            placeholder="Events, attractions, or activities" 
            className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:w-full md:w-1/3">
          <label htmlFor="search-date" className="text-sm font-medium text-neutral-800 mb-1 text-left">When</label>
          <input 
            type="date" 
            id="search-date" 
            className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 w-full"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors duration-200 w-full md:w-auto mt-2 md:mt-0"
        >
          <i className="fas fa-search mr-2"></i> Search
        </button>
      </form>
    </div>
  );
};

export default SearchBox;

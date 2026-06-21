import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faSpinner } from '@fortawesome/free-solid-svg-icons';
import useAISearch from '../../hooks/useAISearch.js';

const AISearchBar = ({ onSearchResults, onClearSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const { searchAsync, loading, error, reset } = useAISearch();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      handleClear();
      return;
    }
    
    try {
      const data = await searchAsync(searchInput);
      onSearchResults(data, searchInput);
    } catch (err) {
      // Error is handled by the hook and displayed below
    }
  };

  const handleClear = () => {
    setSearchInput('');
    reset();
    onClearSearch();
  };

  return (
    <div className="w-full max-w-[640px] flex flex-col gap-2 group mb-4">
      <form onSubmit={handleSearchSubmit}>
        <div className="h-14 w-full flex items-center bg-surface-elevated border border-border rounded-sm focus-within:border-accent focus-within:ring-3 focus-within:ring-accent-glow transition-all duration-200 overflow-hidden">
          <span className="pl-4 text-accent flex items-center justify-center">
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4" />
            )}
          </span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Try: "tech conferences next month"'
            className="flex-grow bg-transparent border-none text-[15px] font-body text-text-primary placeholder-text-muted italic px-3 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className="h-full w-20 bg-accent-fill text-white font-body font-semibold text-[14px] hover:bg-accent-fill-hover transition-colors duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </div>
      </form>
      {error && (
        <p className="text-left font-body text-[12px] text-error px-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default AISearchBar;

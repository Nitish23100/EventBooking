import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import useEvents from '../hooks/useEvents.js';
import EventCard from '../components/events/EventCard.jsx';
import SkeletonCard from '../components/events/SkeletonCard.jsx';

const HomePage = () => {
  const {
    events,
    loading,
    error,
    page,
    setPage,
    pages,
    category,
    setCategory,
    search,
    setSearch,
  } = useEvents('all', 12);

  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'music', label: 'Music' },
    { id: 'tech', label: 'Tech' },
    { id: 'sports', label: 'Sports' },
    { id: 'art', label: 'Art' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'workshop', label: 'Workshop' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setActiveSearch(searchInput);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearch('');
    setActiveSearch('');
    setCategory('all');
  };

  return (
    <div className="bg-bg text-text-primary min-h-[calc(100vh-64px)] pb-16 transition-colors duration-200">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 md:px-8 py-12 md:py-20 flex flex-col items-center text-center max-w-4xl mx-auto">
        <h1 className="font-display font-extrabold text-[36px] sm:text-[56px] leading-[1.1] tracking-tight mb-4 text-text-primary">
          Find your next <br className="sm:hidden" />
          <span className="text-accent">live experience</span>
        </h1>
        <p className="font-body text-text-secondary text-[15px] sm:text-[16px] max-w-lg mb-8 leading-relaxed">
          From underground gigs to stadium nights — book your seat before it's gone.
        </p>

        {/* AI Search Bar Spec 9.2 */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-[640px] flex flex-col gap-2 group mb-4"
        >
          <div className="h-14 w-full flex items-center bg-surface-elevated border border-border rounded-sm focus-within:border-accent focus-within:ring-3 focus-within:ring-accent-glow transition-all duration-200 overflow-hidden">
            <span className="pl-4 text-accent flex items-center justify-center">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Try: "music concerts this weekend with 50+ seats"'
              className="flex-grow bg-transparent border-none text-[15px] font-body text-text-primary placeholder-text-muted italic px-3 focus:outline-none"
            />
            <button
              type="submit"
              className="h-full w-20 bg-accent-fill text-white font-body font-semibold text-[14px] hover:bg-accent-fill-hover transition-colors duration-200 flex-shrink-0"
            >
              Search
            </button>
          </div>
          {activeSearch && (
            <p className="text-left font-body text-[12px] text-text-muted px-1">
              AI-powered search — results filtered by "{activeSearch}"
            </p>
          )}
        </form>

        {/* Category Filter Pills (Mobile Horizontal Scroll Spec 6.7) */}
        <div className="relative w-full max-w-[640px] mt-4 select-none">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mask-gradient">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`h-9 px-4 rounded-pill font-body text-[13px] font-semibold flex-shrink-0 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-glow
                  ${
                    category === cat.id
                      ? 'bg-accent-fill border-accent-fill text-white'
                      : 'bg-transparent border-border text-text-secondary hover:border-accent/40 hover:text-accent'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* Subtle horizontal fade overlay */}
          <div className="absolute right-0 top-0 h-9 w-12 bg-gradient-to-l from-bg to-transparent pointer-events-none hidden mobile-gradient-fade" />
        </div>
      </section>

      {/* Events Listing */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-body font-medium text-[12px] text-text-secondary uppercase tracking-[0.08em]">
            Upcoming Events
          </h2>
          {category !== 'all' || activeSearch ? (
            <button
              onClick={handleClearFilters}
              className="font-body text-[13px] text-accent font-semibold hover:underline"
            >
              Reset Filters
            </button>
          ) : null}
        </div>

        {/* Grid View */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-border rounded-md bg-surface p-8">
            <p className="font-body text-[15px] text-error mb-2">{error}</p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-border text-text-primary rounded-sm hover:border-accent hover:text-accent font-semibold transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        ) : events.length === 0 ? (
          /* Empty State Spec 8.1 */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-md bg-surface p-8">
            <span className="w-12 h-12 text-text-muted/30 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-12 h-12" />
            </span>
            <h3 className="font-display font-bold text-[18px] text-text-primary mb-1">
              No events match your search
            </h3>
            <p className="font-body text-[12px] text-text-secondary max-w-sm mb-6">
              Try a different query or clear filters to browse all our upcoming event listings.
            </p>
            <button
              onClick={handleClearFilters}
              className="h-10 px-6 border border-border text-text-primary rounded-sm hover:border-accent hover:text-accent font-body font-semibold text-[13px] transition-colors duration-200"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-border select-none">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="h-10 px-4 border border-border rounded-sm text-text-primary hover:border-accent hover:text-accent transition-colors duration-200 font-body font-semibold text-[13px] disabled:opacity-40 disabled:pointer-events-none"
                >
                  Previous
                </button>
                <span className="font-mono text-[14px] text-text-secondary">
                  Page {page} of {pages}
                </span>
                <button
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                  className="h-10 px-4 border border-border rounded-sm text-text-primary hover:border-accent hover:text-accent transition-colors duration-200 font-body font-semibold text-[13px] disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;

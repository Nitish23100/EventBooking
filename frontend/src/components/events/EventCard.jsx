import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faLocationDot, faChair, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const EventCard = ({ event }) => {
  const { _id, name, date, venue, category, availableSeats, imageUrl, price } = event;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      to={`/events/${_id}`}
      className="group flex flex-col bg-surface border border-border rounded-md overflow-hidden transition-all duration-200 hover:border-accent/35 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent-glow"
    >
      {/* Image Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface-elevated flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted font-display text-[15px] font-bold uppercase opacity-30 select-none">
            {category}
          </div>
        )}
        {/* Category Badge */}
        <span className="absolute top-3 right-3 px-3 py-1 bg-accent-fill text-white font-body font-semibold text-[10px] tracking-wider uppercase rounded-pill z-10 shadow-sm">
          {category}
        </span>
      </div>

      {/* Content Padding */}
      <div className="p-4 flex flex-col justify-between flex-grow gap-4">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <h3 className="font-body font-semibold text-[16px] text-text-primary line-clamp-2 leading-snug group-hover:text-accent transition-colors duration-200">
            {name}
          </h3>

          {/* Date & Location */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 font-body text-[12px] text-text-secondary">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendarDays} className="w-3.5 h-3.5 text-text-muted" />
              {formattedDate}
            </span>
            <span className="text-text-muted select-none">·</span>
            <span className="flex items-center gap-1.5 truncate max-w-[140px]" title={venue}>
              <FontAwesomeIcon icon={faLocationDot} className="w-3.5 h-3.5 text-text-muted" />
              {venue}
            </span>
          </div>
        </div>

        {/* Seat Count & Action */}
        <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
          {/* Seat Counter */}
          <div className="flex items-center gap-1.5">
            {availableSeats === 0 ? (
              <span className="px-2 py-0.5 bg-error-bg text-error font-body font-semibold text-[11px] rounded-pill">
                Sold Out
              </span>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faChair}
                  className={`w-3.5 h-3.5 ${
                    availableSeats < 10 ? 'text-warning' : 'text-text-secondary'
                  }`}
                />
                <span
                  className={`font-mono text-[13px] font-medium ${
                    availableSeats < 10 ? 'text-warning' : 'text-text-primary'
                  }`}
                >
                  {availableSeats} {availableSeats === 1 ? 'seat' : 'seats'} left
                </span>
              </>
            )}
          </div>

          {/* Price / View Event */}
          <div className="flex items-center gap-1.5 text-accent font-body font-semibold text-[13px]">
            <span>View event</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="w-3.5 h-3.5 transform transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

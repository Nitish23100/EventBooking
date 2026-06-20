import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';

const BookingCard = ({ booking, onCancel }) => {
  const { event, seats, status, _id } = booking;
  const { name, date, venue, imageUrl, category } = event;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isPast = new Date(date) < new Date();
  const bookingIdDisplay = `BK-${_id.slice(-6).toUpperCase()}`;

  // Determine status badge details
  let badgeText = 'Upcoming';
  let badgeStyleClass = 'bg-success-bg text-success';
  let badgeIcon = faCircleCheck;

  if (status === 'cancelled') {
    badgeText = 'Cancelled';
    badgeStyleClass = 'bg-error-bg text-error';
    badgeIcon = faCircleXmark;
  } else if (isPast) {
    badgeText = 'Past';
    badgeStyleClass = 'bg-surface-elevated text-text-secondary';
    badgeIcon = null;
  }

  return (
    <div className="bg-surface border border-border rounded-md p-4 flex flex-col sm:flex-row gap-4 transition-all duration-200 hover:border-accent/20">
      {/* 80x80 Thumbnail */}
      <div className="w-full sm:w-20 sm:h-20 h-36 aspect-[16/9] sm:aspect-square rounded-sm overflow-hidden bg-surface-elevated border border-border flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted font-display text-[11px] font-bold uppercase opacity-30 select-none">
            {category}
          </div>
        )}
      </div>

      {/* Info Block */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link
            to={`/events/${event._id}`}
            className="font-display font-semibold text-[16px] text-text-primary hover:text-accent transition-colors leading-tight line-clamp-1"
          >
            {name}
          </Link>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-[12px] text-text-secondary mt-1">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendarDays} className="w-3 h-3 text-text-muted" />
              {formattedDate} · {formattedTime}
            </span>
            <span className="hidden sm:inline text-text-muted">|</span>
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 text-text-muted" />
              {venue}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 sm:mt-1 font-body">
          <span className="flex items-center gap-1.5 font-mono text-[13px] text-text-primary">
            <FontAwesomeIcon icon={faChair} className="w-3.5 h-3.5 text-text-secondary" />
            {seats} {seats === 1 ? 'seat' : 'seats'}
          </span>
          <span className="font-mono text-[11px] text-text-muted">
            ID: {bookingIdDisplay}
          </span>
        </div>
      </div>

      {/* Status & Cancel Action Column */}
      <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 border-border pt-3 sm:pt-0 flex-shrink-0">
        {/* Status Badge */}
        <span className={`px-3 py-1 rounded-pill font-body text-[12px] font-semibold flex items-center gap-1.5 ${badgeStyleClass}`}>
          {badgeIcon && <FontAwesomeIcon icon={badgeIcon} className="w-3.5 h-3.5" />}
          {badgeText}
        </span>

        {/* Cancel Button */}
        {status === 'confirmed' && !isPast && (
          <button
            type="button"
            onClick={() => onCancel(booking)}
            className="h-8 px-3.5 border border-border hover:border-error hover:text-error rounded-sm font-body font-semibold text-[12px] text-text-secondary transition-all duration-200 focus:outline-none"
          >
            Cancel booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;

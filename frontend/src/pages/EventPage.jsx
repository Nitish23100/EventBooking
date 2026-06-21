import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faClock,
  faLocationDot,
  faTag,
  faMapPin,
  faArrowLeft,
  faChair,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import useEventDetails from '../hooks/useEventDetails.js';
import { useAuthStore } from '../stores/authStore.js';
import { useBookings } from '../hooks/useBookings.js';
import { useToast } from '../context/ToastContext.jsx';
import SeatCounter from '../components/events/SeatCounter.jsx';
import BookingForm from '../components/bookings/BookingForm.jsx';

const EventPage = () => {
  const { id } = useParams();
  const { event, loading, error, refetch } = useEventDetails(id);

  // ── All useState hooks MUST be declared before any conditional return ──────
  const [bookingLoading, setBookingLoading] = useState(false);
  const [mobileSeatCount, setMobileSeatCount] = useState(1);

  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createBooking } = useBookings();
  const { toast } = useToast();

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-bg text-text-primary">
        {/* Full-page wordmark loader — DesignSkills §9.8 */}
        <div className="flex flex-col items-center gap-4">
          <span className="font-display font-extrabold text-3xl text-accent animate-pulse">
            eventflow
          </span>
          <div className="w-16 h-0.5 bg-border relative overflow-hidden rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-accent"
              style={{ animation: 'shimmer 1.2s infinite linear' }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Error / not found state ─────────────────────────────────────────────────
  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-bg text-text-primary p-4 text-center">
        <h2 className="font-display font-bold text-2xl text-error mb-2">
          Failed to load event
        </h2>
        <p className="font-body text-text-secondary mb-6">{error || 'Event not found'}</p>
        <Link
          to="/"
          className="h-10 px-6 border border-border rounded-sm text-text-primary hover:border-accent hover:text-accent font-body font-semibold text-[13px] transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to events
        </Link>
      </div>
    );
  }

  const { name, description, date, venue, category, totalSeats, availableSeats, imageUrl, price } =
    event;

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

  const isSoldOut = availableSeats === 0;
  const isPastEvent = new Date(date) < new Date();

  // ── Booking confirmation handler (passed down to BookingForm) ───────────────
  const handleConfirmBooking = async (seatCount) => {
    if (!user) {
      toast('Authentication Required', 'Please log in to book seats.', 'warning');
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    const result = await createBooking(id, seatCount);
    setBookingLoading(false);

    if (result.success) {
      toast('Booking Successful!', `Successfully booked ${seatCount} seats.`, 'success');
      await refetch();
      navigate('/bookings');
    } else {
      toast('Booking Failed', result.error, 'error');
    }
  };

  // ── Mobile sticky bar derived value (useState is hoisted to top) ────────────
  const mobileTotalPrice = mobileSeatCount * price;

  const handleMobileIncrement = () => {
    if (mobileSeatCount < availableSeats) setMobileSeatCount((p) => p + 1);
  };
  const handleMobileDecrement = () => {
    if (mobileSeatCount > 1) setMobileSeatCount((p) => p - 1);
  };

  const handleMobileBookNow = async () => {
    if (isSoldOut) {
      toast('Waitlist Registered', 'Waitlist subscription has been noted.', 'success');
      return;
    }
    if (!user) {
      toast('Authentication Required', 'Please log in to book seats.', 'warning');
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    const result = await createBooking(id, mobileSeatCount);
    setBookingLoading(false);

    if (result.success) {
      toast('Booking Successful!', `Successfully booked ${mobileSeatCount} seats.`, 'success');
      await refetch();
      navigate('/bookings');
    } else {
      toast('Booking Failed', result.error, 'error');
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="bg-bg text-text-primary min-h-[calc(100vh-64px)] pb-24 lg:pb-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-[13px] text-text-secondary hover:text-accent mb-6 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
          Back to events
        </Link>

        {/* Two-column grid — DesignSkills §8.2 lg:grid-cols-[1fr_400px] */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Hero image / category fallback */}
            <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden bg-surface-elevated border border-border">
              {imageUrl ? (
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted font-display text-[24px] font-bold uppercase opacity-20 select-none">
                  {category}
                </div>
              )}
            </div>

            {/* Event name */}
            <h1 className="font-display font-bold text-[28px] sm:text-[36px] text-text-primary leading-tight">
              {name}
            </h1>

            {/* Metadata pills — DesignSkills §8.2 */}
            <div className="flex flex-wrap gap-3 select-none">
              <div className="flex items-center gap-2 bg-surface-elevated border border-border px-3.5 py-2 rounded-pill font-body text-[13px] text-text-secondary font-medium">
                <FontAwesomeIcon icon={faCalendarDays} className="w-3.5 h-3.5 text-text-muted" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2 bg-surface-elevated border border-border px-3.5 py-2 rounded-pill font-body text-[13px] text-text-secondary font-medium">
                <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5 text-text-muted" />
                {formattedTime}
              </div>
              <div className="flex items-center gap-2 bg-surface-elevated border border-border px-3.5 py-2 rounded-pill font-body text-[13px] text-text-secondary font-medium">
                <FontAwesomeIcon icon={faLocationDot} className="w-3.5 h-3.5 text-text-muted" />
                {venue}
              </div>
              {/* Category badge */}
              <div className="flex items-center gap-2 bg-accent-glow/5 border border-accent/20 px-3.5 py-2 rounded-pill font-body text-[13px] text-accent font-semibold">
                <FontAwesomeIcon icon={faTag} className="w-3.5 h-3.5" />
                <span className="capitalize">{category}</span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-3">
              <h2 className="font-body font-bold text-[12px] text-text-secondary uppercase tracking-[0.08em]">
                About The Event
              </h2>
              <p className="font-body text-[15px] text-text-secondary leading-[1.7] whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* WHERE section — DesignSkills §8.2 */}
            <div className="flex flex-col gap-3">
              <h2 className="font-body font-bold text-[12px] text-text-secondary uppercase tracking-[0.08em]">
                Where
              </h2>
              <div className="flex flex-col justify-center items-center h-44 rounded-md border border-border bg-surface-elevated p-6 text-center select-none">
                <FontAwesomeIcon icon={faMapPin} className="text-accent/30 w-8 h-8 mb-2" />
                <h3 className="font-body font-semibold text-[15px] text-text-primary mb-1">
                  {venue}
                </h3>
                <p className="font-body text-[13px] text-text-muted">
                  Static location block — no map configuration required.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right column — sticky booking panel (desktop) ─────────────── */}
          <div className="hidden lg:block">
            <aside className="sticky top-24 bg-surface border border-border rounded-lg p-6 flex flex-col gap-6">
              {/* SeatCounter — extracted component */}
              <SeatCounter availableSeats={availableSeats} totalSeats={totalSeats} />

              <div className="border-t border-border w-full" />

              {/* BookingForm — extracted component */}
              <BookingForm
                event={event}
                onConfirm={handleConfirmBooking}
                isLoading={bookingLoading}
              />
            </aside>
          </div>

        </div>
      </div>

      {/* ── Mobile sticky bottom action bar — DesignSkills §6.5 ─────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border px-4 py-3 flex items-center justify-between pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="flex flex-col">
          <span className="font-body text-[11px] text-text-secondary uppercase tracking-wider flex items-center gap-1">
            <FontAwesomeIcon icon={faChair} className="w-3 h-3 text-text-muted" />
            {isPastEvent ? 'Ended' : isSoldOut ? 'Sold out' : `${availableSeats} left`}
          </span>
          <span className="font-mono text-[16px] font-bold text-text-primary">
            ₹{isSoldOut || isPastEvent ? '0' : mobileTotalPrice.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini stepper */}
          {!isSoldOut && !isPastEvent && (
            <div className="flex items-center bg-surface-elevated border border-border rounded-sm h-10 px-2 gap-3">
              <button
                type="button"
                onClick={handleMobileDecrement}
                disabled={mobileSeatCount <= 1}
                className="w-6 h-6 flex items-center justify-center rounded-full text-text-secondary hover:text-accent disabled:opacity-40"
                aria-label="Decrease seat count"
              >
                <FontAwesomeIcon icon={faMinus} className="w-2.5 h-2.5" />
              </button>
              <span className="font-mono text-[14px] font-bold text-text-primary">
                {mobileSeatCount}
              </span>
              <button
                type="button"
                onClick={handleMobileIncrement}
                disabled={mobileSeatCount >= availableSeats}
                className="w-6 h-6 flex items-center justify-center rounded-full text-text-secondary hover:text-accent disabled:opacity-40"
                aria-label="Increase seat count"
              >
                <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={isPastEvent ? undefined : handleMobileBookNow}
            disabled={bookingLoading || isPastEvent}
            className={`h-10 px-4 flex items-center justify-center font-body font-semibold text-[13px] rounded-sm transition-all duration-200 disabled:opacity-50
              ${
                isPastEvent
                  ? 'bg-surface-elevated text-text-muted border border-border cursor-not-allowed opacity-70'
                  : isSoldOut
                    ? 'border border-border bg-transparent text-text-primary hover:text-accent'
                    : 'bg-accent-fill text-white hover:bg-accent-fill-hover'
              }
            `}
          >
            {bookingLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPastEvent ? (
              'Event Ended'
            ) : isSoldOut ? (
              'Join Waitlist'
            ) : (
              'Book Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPage;

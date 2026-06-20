import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faClock,
  faLocationDot,
  faChair,
  faTag,
  faMapPin,
  faTriangleExclamation,
  faPlus,
  faMinus,
  faArrowLeft,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import useEventDetails from '../hooks/useEventDetails.js';
import { useAuthStore } from '../stores/authStore.js';
import { useBookings } from '../hooks/useBookings.js';
import { useToast } from '../context/ToastContext.jsx';

const EventPage = () => {
  const { id } = useParams();
  const { event, loading, error, refetch } = useEventDetails(id);
  const [seatCount, setSeatCount] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createBooking } = useBookings();
  const { toast } = useToast();

  // Reset seat count to 1 if event changes
  useEffect(() => {
    setSeatCount(1);
  }, [event]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-bg text-text-primary">
        {/* Full Page Loader Shimmer Spec 9.8 */}
        <div className="flex flex-col items-center gap-4">
          <span className="font-display font-extrabold text-3xl text-accent animate-pulse">
            eventflow
          </span>
          <div className="w-16 h-0.5 bg-border relative overflow-hidden rounded-full">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-accent animate-[shimmer_1.5s_infinite_linear]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-bg text-text-primary p-4 text-center">
        <h2 className="font-display font-bold text-2xl text-error mb-2">Failed to load event</h2>
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

  const { name, description, date, venue, category, totalSeats, availableSeats, imageUrl, price } = event;

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
  const isLowSeats = availableSeats > 0 && availableSeats < 10;
  const totalPrice = seatCount * price;

  const handleIncrement = () => {
    if (seatCount < availableSeats) {
      setSeatCount((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (seatCount > 1) {
      setSeatCount((prev) => prev - 1);
    }
  };

  const handleBookNow = () => {
    if (isSoldOut) {
      toast('Waitlist Registered', 'Waitlist subscription is registered.', 'success');
      return;
    }

    if (!user) {
      toast('Authentication Required', 'Please log in to book seats.', 'warning');
      navigate('/login');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    const result = await createBooking(id, seatCount);
    setBookingLoading(false);
    setShowConfirmModal(false);

    if (result.success) {
      toast('Booking Successful!', `Successfully booked ${seatCount} seats.`, 'success');
      await refetch();
      navigate('/bookings');
    } else {
      toast('Booking Failed', result.error, 'error');
    }
  };

  // Determine Counter Colors & Text
  let counterColorClass = 'text-success';
  let counterLabel = 'seats available';
  let pulseRingColor = 'bg-success';
  let showWarningIcon = false;

  if (isSoldOut) {
    counterColorClass = 'text-error';
    counterLabel = 'Sold out';
    pulseRingColor = 'bg-error';
  } else if (isLowSeats) {
    counterColorClass = 'text-warning';
    counterLabel = 'Almost sold out';
    pulseRingColor = 'bg-warning';
    showWarningIcon = true;
  }

  return (
    <div className="bg-bg text-text-primary min-h-[calc(100vh-64px)] pb-24 lg:pb-16 transition-colors duration-200">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
        {/* Back Link above image on mobile and desktop */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-[13px] text-text-secondary hover:text-accent mb-6 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
          Back to events
        </Link>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Image Banner */}
            <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden bg-surface-elevated border border-border">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted font-display text-[24px] font-bold uppercase opacity-30 select-none">
                  {category}
                </div>
              )}
            </div>

            {/* Event Name */}
            <h1 className="font-display font-bold text-[28px] sm:text-[36px] text-text-primary leading-tight">
              {name}
            </h1>

            {/* Metadata Pills */}
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

            {/* WHERE Section */}
            <div className="flex flex-col gap-3">
              <h2 className="font-body font-bold text-[12px] text-text-secondary uppercase tracking-[0.08em]">
                Where
              </h2>
              <div className="flex flex-col justify-center items-center h-44 rounded-md border border-border bg-surface-elevated p-6 text-center select-none">
                <FontAwesomeIcon icon={faMapPin} className="text-accent/30 w-8 h-8 mb-2" />
                <h3 className="font-body font-semibold text-[15px] text-text-primary mb-1">{venue}</h3>
                <p className="font-body text-[13px] text-text-muted">Static location block — no map configuration required.</p>
              </div>
            </div>
          </div>

          {/* Right Column / Sticky Booking Panel (Desktop only) */}
          <div className="hidden lg:block">
            <aside className="sticky top-24 bg-surface border border-border rounded-lg p-6 flex flex-col gap-6">
              
              {/* Live Seat Counter */}
              <div className="flex flex-col gap-2 items-start relative select-none">
                <div className="flex items-center gap-4">
                  {/* Chair & Ring Container */}
                  <div className="relative w-12 h-12 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
                    <FontAwesomeIcon icon={faChair} className={`w-5 h-5 ${counterColorClass}`} />
                    
                    {/* Pulsing Sonar Ring */}
                    <span className={`absolute inset-0 rounded-full animate-sonar ${pulseRingColor}`} />
                  </div>
                  
                  {/* Large Numbers */}
                  <div className="flex flex-col">
                    <span className="font-mono text-4xl font-bold text-text-primary">
                      {availableSeats}
                    </span>
                    <span className={`font-body font-semibold text-[12px] uppercase tracking-wider ${counterColorClass} flex items-center gap-1.5`}>
                      {showWarningIcon && <FontAwesomeIcon icon={faTriangleExclamation} />}
                      {counterLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border w-full" />

              {/* Seat Stepper */}
              <div className="flex flex-col gap-3">
                <label className="font-body font-semibold text-[12px] text-text-secondary uppercase tracking-[0.08em]">
                  How many seats?
                </label>
                <div className="flex items-center justify-between bg-surface-elevated border border-border rounded-sm h-12 px-4">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={seatCount <= 1 || isSoldOut}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-surface border border-border disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
                    aria-label="Decrease seat count"
                  >
                    <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-[18px] font-bold text-text-primary">
                    {isSoldOut ? 0 : seatCount}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={seatCount >= availableSeats || isSoldOut}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-surface border border-border disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
                    aria-label="Increase seat count"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Price Calculation Row */}
              <div className="flex items-center justify-between font-body text-[14px]">
                <span className="text-text-secondary">
                  {isSoldOut ? '0' : seatCount} × ₹{price.toLocaleString('en-IN')}
                </span>
                <span className="font-mono font-bold text-[18px] text-text-primary">
                  ₹{isSoldOut ? '0' : totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Primary CTA */}
              <button
                type="button"
                onClick={handleBookNow}
                className={`w-full h-12 flex items-center justify-center font-body font-semibold text-[15px] rounded-sm transition-all duration-200
                  ${
                    isSoldOut
                      ? 'border border-border bg-transparent text-text-primary hover:border-accent hover:text-accent'
                      : 'bg-accent-fill text-white hover:bg-accent-fill-hover hover:shadow-[0_0_20px_rgba(255,77,109,0.27)]'
                  }
                `}
              >
                {isSoldOut ? 'Join Waitlist' : 'Book Now'}
              </button>

              <p className="text-center font-body text-[11px] text-text-muted leading-relaxed select-none">
                Booking confirmed instantly. Free cancellation before 24h.
              </p>
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar Spec 6.5 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border px-4 py-3 flex items-center justify-between shadow-lg pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="flex flex-col">
          <span className="font-body text-[11px] text-text-secondary uppercase tracking-wider flex items-center gap-1">
            <FontAwesomeIcon icon={faChair} className="w-3 h-3 text-text-muted" />
            {isSoldOut ? 'Sold out' : `${availableSeats} left`}
          </span>
          <span className="font-mono text-[16px] font-bold text-text-primary">
            ₹{isSoldOut ? '0' : totalPrice.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini Stepper inside mobile bar */}
          {!isSoldOut && (
            <div className="flex items-center bg-surface-elevated border border-border rounded-sm h-10 px-2 gap-3">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={seatCount <= 1}
                className="w-6 h-6 flex items-center justify-center rounded-full text-text-secondary hover:text-accent disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faMinus} className="w-2.5 h-2.5" />
              </button>
              <span className="font-mono text-[14px] font-bold text-text-primary">
                {seatCount}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={seatCount >= availableSeats}
                className="w-6 h-6 flex items-center justify-center rounded-full text-text-secondary hover:text-accent disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faPlus} className="w-2.5 h-2.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleBookNow}
            className={`h-10 px-4 flex items-center justify-center font-body font-semibold text-[13px] rounded-sm transition-all duration-200
              ${
                isSoldOut
                  ? 'border border-border bg-transparent text-text-primary hover:text-accent'
                  : 'bg-accent-fill text-white hover:bg-accent-fill-hover'
              }
            `}
          >
            {isSoldOut ? 'Join Waitlist' : 'Book Now'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-overlay backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="bg-surface border border-border rounded-lg max-w-[440px] w-full p-6 sm:p-8 z-10 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-secondary transition-colors"
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>
            <h3 className="font-display font-bold text-[20px] text-text-primary mb-2">
              Confirm Booking
            </h3>
            <p className="font-body text-[14px] text-text-secondary leading-relaxed mb-6">
              You are reserving <span className="font-semibold text-text-primary">{seatCount} {seatCount === 1 ? 'seat' : 'seats'}</span> for <span className="font-semibold text-text-primary">"{name}"</span>. The total cost is <span className="font-semibold text-text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={bookingLoading}
                className="h-11 px-4 border border-border hover:border-accent hover:text-accent rounded-sm font-body font-semibold text-[14px] text-text-primary transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
                className="h-11 px-4 bg-accent-fill text-white hover:bg-accent-fill-hover rounded-sm font-body font-semibold text-[14px] transition-all duration-200 flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;

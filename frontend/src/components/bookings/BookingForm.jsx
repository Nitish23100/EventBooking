import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faXmark } from '@fortawesome/free-solid-svg-icons';

/**
 * BookingForm — DesignSkills §8.2 "Right column / Booking panel".
 *
 * Handles: seat stepper (+/-), price summary, "Book Now" / "Join Waitlist" CTA,
 * and the confirmation modal (desktop) / bottom-sheet-style modal (mobile).
 *
 * Props:
 *   event           {object}   Full event document (name, price, availableSeats …)
 *   onConfirm       {function} Called with seatCount when user confirms. Must return
 *                              { success, error } — the parent handles toasts/navigation.
 *   isLoading       {boolean}  While booking request is in-flight — disables CTA.
 */
const BookingForm = ({ event, onConfirm, isLoading = false }) => {
  const { name, price, availableSeats, date } = event;

  const isSoldOut = availableSeats === 0;
  const isPastEvent = new Date(date) < new Date();

  const formattedPastDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const [seatCount, setSeatCount] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const totalPrice = seatCount * price;

  const handleIncrement = () => {
    if (seatCount < availableSeats) setSeatCount((p) => p + 1);
  };

  const handleDecrement = () => {
    if (seatCount > 1) setSeatCount((p) => p - 1);
  };

  const handleBookNowClick = () => {
    setShowModal(true);
  };

  const handleCancelModal = () => {
    setShowModal(false);
  };

  const handleConfirm = async () => {
    await onConfirm(seatCount);
    // Parent decides whether to close modal (e.g. on error keep modal closed but show toast)
    setShowModal(false);
  };

  return (
    <>
      {/* ─────────────────────── Seat Stepper ─────────────────────── */}
      <div className="flex flex-col gap-3">
        <label className="font-body font-semibold text-[12px] text-text-secondary uppercase tracking-[0.08em]">
          How many seats?
        </label>
        <div className="flex items-center justify-between bg-surface-elevated border border-border rounded-sm h-12 px-4">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={seatCount <= 1 || isSoldOut || isPastEvent}
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
            disabled={seatCount >= availableSeats || isSoldOut || isPastEvent}
            className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:text-accent hover:bg-surface border border-border disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
            aria-label="Increase seat count"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ─────────────────────── Price Row ─────────────────────── */}
      <div className="flex items-center justify-between font-body text-[14px]">
        <span className="text-text-secondary">
          {isSoldOut ? 0 : seatCount} × ₹{price.toLocaleString('en-IN')}
        </span>
        <span className="font-mono font-bold text-[18px] text-text-primary">
          ₹{isSoldOut ? '0' : totalPrice.toLocaleString('en-IN')}
        </span>
      </div>

      {/* ─────────────────────── Primary CTA ─────────────────────── */}
      <button
        type="button"
        onClick={(isSoldOut || isPastEvent) ? undefined : handleBookNowClick}
        disabled={isLoading || isPastEvent}
        className={`w-full h-12 flex items-center justify-center font-body font-semibold text-[15px] rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isPastEvent
              ? 'bg-surface-elevated text-text-muted border border-border cursor-not-allowed opacity-70'
              : isSoldOut
                ? 'border border-border bg-transparent text-text-primary hover:border-accent hover:text-accent cursor-default'
                : 'bg-accent-fill text-white hover:bg-accent-fill-hover hover:shadow-[0_0_20px_rgba(255,77,109,0.27)]'
          }
        `}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : isPastEvent ? (
          'Event Ended'
        ) : isSoldOut ? (
          'Join Waitlist'
        ) : (
          'Book Now'
        )}
      </button>

      {/* Reassurance caption — DesignSkills §8.2 */}
      {isPastEvent ? (
        <p className="text-center font-body text-[11px] text-text-muted leading-relaxed select-none">
          This event ended on {formattedPastDate}.
        </p>
      ) : (
        <p className="text-center font-body text-[11px] text-text-muted leading-relaxed select-none">
          Booking confirmed instantly. Free cancellation before 24h.
        </p>
      )}

      {/* ─────────────────────── Confirmation Modal ─────────────────────── */}
      {/* DesignSkills §9.6 — overlay + card (desktop), bottom sheet (mobile) */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-overlay backdrop-blur-sm"
            onClick={handleCancelModal}
            aria-hidden="true"
          />

          {/* Modal card */}
          <div
            className="
              relative z-10 bg-surface border border-border w-full
              rounded-t-2xl sm:rounded-lg
              max-w-full sm:max-w-[440px]
              p-6 sm:p-8
              shadow-2xl
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-booking-title"
          >
            {/* Drag handle (mobile bottom-sheet UX cue) */}
            <div className="flex justify-center mb-4 sm:hidden">
              <div className="w-9 h-1 rounded-full bg-border" aria-hidden="true" />
            </div>

            {/* Close button */}
            <button
              onClick={handleCancelModal}
              className="absolute top-4 right-4 text-text-muted hover:text-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-glow rounded-sm"
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            <h3
              id="confirm-booking-title"
              className="font-display font-bold text-[20px] text-text-primary mb-2"
            >
              Confirm Booking
            </h3>
            <p className="font-body text-[14px] text-text-secondary leading-relaxed mb-6">
              You are reserving{' '}
              <span className="font-semibold text-text-primary">
                {seatCount} {seatCount === 1 ? 'seat' : 'seats'}
              </span>{' '}
              for{' '}
              <span className="font-semibold text-text-primary">"{name}"</span>. The total cost
              is{' '}
              <span className="font-semibold text-text-primary">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
              .
            </p>

            {/* Button row — ghost (secondary) left, filled (primary) right */}
            {/* On mobile: stack full-width, primary on top (DesignSkills §9.6) */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={handleCancelModal}
                disabled={isLoading}
                className="h-11 px-4 border border-border hover:border-accent hover:text-accent rounded-sm font-body font-semibold text-[14px] text-text-primary transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className="h-11 px-4 bg-accent-fill text-white hover:bg-accent-fill-hover rounded-sm font-body font-semibold text-[14px] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;

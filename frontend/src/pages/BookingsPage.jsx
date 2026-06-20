import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faChevronRight, faXmark, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useBookings } from '../hooks/useBookings.js';
import { useToast } from '../context/ToastContext.jsx';
import BookingCard from '../components/bookings/BookingCard.jsx';
import Spinner from '../components/ui/Spinner.jsx';

const BookingsPage = () => {
  const { bookings, loading, error, cancelBooking } = useBookings();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Filter bookings
  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.event.date) >= now && b.status === 'confirmed'
  );
  const pastOrCancelledBookings = bookings.filter(
    (b) => new Date(b.event.date) < now || b.status === 'cancelled'
  );

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastOrCancelledBookings;

  // Stats
  const totalBookingsCount = bookings.length;
  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed' && new Date(b.event.date) >= now).length;
  const cancelledBookingsCount = bookings.filter((b) => b.status === 'cancelled').length;

  const handleCancelClick = (booking) => {
    setSelectedBookingForCancel(booking);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;
    
    const bookingId = selectedBookingForCancel._id;
    setCancellingId(bookingId);
    
    const result = await cancelBooking(bookingId);
    setCancellingId(null);
    setSelectedBookingForCancel(null);

    if (result.success) {
      toast('Booking Cancelled', `Your seats for "${selectedBookingForCancel.event.name}" have been released.`, 'success');
    } else {
      toast('Cancellation Failed', result.error, 'error');
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-bg">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-bg text-text-primary min-h-[calc(100vh-64px)] pb-16 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-[28px] sm:text-[36px] text-text-primary leading-tight">
              My Bookings
            </h1>
            <p className="font-body text-[14px] text-text-secondary mt-1">
              Keep track of your reserved seats and bookings.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-body text-[13px] font-semibold text-accent hover:underline self-start sm:self-auto"
          >
            Browse Events
            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 select-none">
          <div className="bg-surface border border-border rounded-md p-4 flex flex-col justify-between">
            <span className="font-body font-semibold text-[11px] text-text-secondary uppercase tracking-wider">
              Total
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-text-primary mt-2">
              {totalBookingsCount}
            </span>
          </div>
          <div className="bg-surface border border-border rounded-md p-4 flex flex-col justify-between">
            <span className="font-body font-semibold text-[11px] text-text-secondary uppercase tracking-wider text-success">
              Active
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-success mt-2">
              {activeBookingsCount}
            </span>
          </div>
          <div className="bg-surface border border-border rounded-md p-4 flex flex-col justify-between">
            <span className="font-body font-semibold text-[11px] text-text-secondary uppercase tracking-wider text-error">
              Cancelled
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-error mt-2">
              {cancelledBookingsCount}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-bottom border-border mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 px-4 font-body font-semibold text-[14px] border-b-2 transition-all focus:outline-none
              ${
                activeTab === 'upcoming'
                  ? 'border-accent text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }
            `}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 px-4 font-body font-semibold text-[14px] border-b-2 transition-all focus:outline-none
              ${
                activeTab === 'past'
                  ? 'border-accent text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }
            `}
          >
            Past & Cancelled ({pastOrCancelledBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        {error ? (
          <div className="bg-surface border border-border rounded-md p-6 text-center">
            <p className="font-body text-[15px] text-error mb-2">{error}</p>
          </div>
        ) : displayedBookings.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center border border-border rounded-md bg-surface p-8">
            <span className="w-12 h-12 text-text-muted/30 flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={faTicket} className="w-12 h-12" />
            </span>
            <h3 className="font-display font-bold text-[18px] text-text-primary mb-1">
              No bookings found
            </h3>
            <p className="font-body text-[12px] text-text-secondary max-w-sm mb-6">
              {activeTab === 'upcoming'
                ? "You don't have any active upcoming events reserved."
                : "You don't have any past or cancelled bookings yet."}
            </p>
            {activeTab === 'upcoming' && (
              <Link
                to="/"
                className="h-10 px-6 bg-accent-fill text-white rounded-sm hover:bg-accent-fill-hover font-body font-semibold text-[13px] transition-colors flex items-center justify-center"
              >
                Browse events
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayedBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancelClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-overlay backdrop-blur-sm"
            onClick={() => setSelectedBookingForCancel(null)}
          />

          {/* Modal Content */}
          <div className="bg-surface border border-border rounded-lg max-w-[440px] w-full p-6 sm:p-8 z-10 shadow-2xl relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBookingForCancel(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-secondary transition-colors"
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-[20px] text-text-primary mb-2">
              Cancel this booking?
            </h3>
            <p className="font-body text-[14px] text-text-secondary leading-relaxed mb-6">
              Your seats for <span className="font-semibold text-text-primary">"{selectedBookingForCancel.event.name}"</span> will be released back to the event availability. This action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => setSelectedBookingForCancel(null)}
                disabled={cancellingId !== null}
                className="h-11 px-4 border border-border hover:border-accent hover:text-accent rounded-sm font-body font-semibold text-[14px] text-text-primary transition-all duration-200 disabled:opacity-50"
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancellingId !== null}
                className="h-11 px-4 bg-error text-white hover:bg-error/90 rounded-sm font-body font-semibold text-[14px] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {cancellingId ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Cancel booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;

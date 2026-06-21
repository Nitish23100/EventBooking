import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

/**
 * SeatCounter — DesignSkills §8.2 "Live Seat Counter" (signature component).
 *
 * Props:
 *   availableSeats  {number}  Current available seats (real-time via Socket.IO)
 *   totalSeats      {number}  Total capacity of the event
 */
const SeatCounter = ({ availableSeats, totalSeats }) => {
  const isSoldOut = availableSeats === 0;
  const isLowSeats = availableSeats > 0 && availableSeats < 10;

  // Colour tokens derived from design system tokens
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
    <div className="flex flex-col gap-2 items-start relative select-none">
      <div className="flex items-center gap-4">
        {/* Chair icon + sonar ring container (DesignSkills §7 — signature pulse ring) */}
        <div className="relative w-12 h-12 rounded-full bg-surface-elevated border border-border flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faChair} className={`w-5 h-5 ${counterColorClass}`} />

          {/* Pulsing sonar ring — 2s loop, accent colour (or warning/error when low/sold out) */}
          <span
            className={`absolute inset-0 rounded-full animate-sonar ${pulseRingColor} opacity-40`}
            aria-hidden="true"
          />
        </div>

        {/* Large monospaced seat number + label (DesignSkills §3 — 'data' token at 48px) */}
        <div className="flex flex-col">
          <span className="font-mono text-[48px] leading-none font-bold text-text-primary">
            {availableSeats}
          </span>
          <span
            className={`font-body font-semibold text-[12px] uppercase tracking-wider ${counterColorClass} flex items-center gap-1.5 mt-1`}
          >
            {showWarningIcon && (
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-3 h-3" />
            )}
            {counterLabel}
          </span>
        </div>
      </div>

      {/* Subtle seat stats below */}
      {!isSoldOut && (
        <p className="font-body text-[12px] text-text-muted">
          {availableSeats} of {totalSeats} seats remaining
        </p>
      )}
    </div>
  );
};

export default SeatCounter;

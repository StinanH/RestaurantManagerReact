import React from 'react';

const BookingButton = ({ selectedNrOfPeople, selectedDate, selectedBooking, onClick }) => {
  // Format the date (e.g., Dec 31)
  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(selectedDate))
    : '';

  // Format the time (e.g., 11:00)
  const formattedTime = selectedBooking && selectedBooking.requestedTime
    ? new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(selectedBooking.requestedTime))
    : '';

    const peopleText = selectedNrOfPeople === 1 ? "1 guest" : `${selectedNrOfPeople} guests`;
    
    return (
    <button className="confirmbookingbutton" onClick={onClick}>
      <div className="booking-details">
      <div>Confirm booking :</div>
        <div className='confirmbookingbuttoninfo'>
          {peopleText}
        </div>
        <div>
          on {formattedDate}
        </div>
        <div>
          at {formattedTime}
        </div>
      </div>
      
    </button>
  );
};

export default BookingButton;
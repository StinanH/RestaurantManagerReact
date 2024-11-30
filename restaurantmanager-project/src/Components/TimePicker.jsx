import React from 'react';

const TimePicker = ({ availableTimes, onTimeSelect, selectedTime }) => {
  // Helper function to chunk availableTimes into rows of 4
  const chunkTimes = (times, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < times.length; i += chunkSize) {
      chunks.push(times.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const timeChunks = chunkTimes(availableTimes, 4);

  return (
    <div>
      <h3>Select a Time:</h3>
      <div className="button-container">
        {availableTimes.length === 0 ? (
          <p style={{ color: 'red' }}>No available times on this date.</p>
        ) : (
          timeChunks.map((row, rowIndex) => (
            <div key={rowIndex} className="Timerow">
              {row.map((booking) => {
                const time = new Date(booking.requestedTime);
                const formattedTime = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;

                // Check if this time is the selected time and add a class to highlight it
                const isSelected = selectedTime && selectedTime.getTime() === time.getTime();
                return (
                  <button
                      key={booking.requestedTime}
                      className={`Timecolumn ${isSelected ? 'selected' : ''}`}
                      onClick={() => onTimeSelect(booking)} // Pass the booking object
                  >
                      {formattedTime}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimePicker;
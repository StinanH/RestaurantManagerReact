import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar';

const DatePicker = ({ SelectedDate }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const todaysDate = new Date();
    const lastPossibleDate = new Date();
    lastPossibleDate.setMonth(todaysDate.getMonth() + 3);

    // Use useEffect to reset the selected date when the parent (selectedNrOfPeople) is set to null
    useEffect(() => {
        // Reset date selection when the parent component's selectedNrOfPeople is reset
        if (SelectedDate === null) {
            setSelectedDate(null);  // Clear the local state
        }
    }, [SelectedDate]);  // Run this effect when selectedNrOfPeople prop changes

    const handleDateChange = (date) => {
        setSelectedDate(date);          // Update local state
        SelectedDate(date);              // Call the parent function to update the parent state
    }

    return (
        <div>
            <h3>Date :</h3>
            <div className="calendar-holder">
                <Calendar
                    view="month"
                    value={selectedDate}
                    onChange={handleDateChange}    // Use the handleDateChange function
                    minDate={todaysDate}
                    maxDate={lastPossibleDate}
                />
            </div>
        </div>
    );
}

export default DatePicker;
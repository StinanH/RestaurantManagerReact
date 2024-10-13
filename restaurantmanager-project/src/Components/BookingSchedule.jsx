import axios from 'axios'
import { useEffect, useState } from 'react'

export default function BookingSchedule() {
    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedNrOfPeople, setSelectedNrOfPeople] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(true);


    async function BookTimeslot() {
        
    const restaurantId = 1; // Update this based on your logic
    const userId = 6; // Update this based on your logic
    const nrOfPeople = selectedNrOfPeople; // Number of people from state
    const requests = ''; // Any special requests you might want to add

    // Ensure selectedTime is set before attempting to book
    if (!selectedTime) {
        console.error('No time selected for booking.');
        return;
    }

    else {
        console.log("requested time : ", selectedTime.toISOString())
    }

    // Create the booking object in the required format
    const bookingToPost = {
        restaurantId: restaurantId,
        requestedTime: selectedTime.toISOString(), // Convert selectedTime to ISO string
        userId: userId,
        nrOfPeople: nrOfPeople,
        requests: requests // Include any requests if needed
    };

        try {
            // Make the POST request
            const response = await axios.post('https://localhost:7295/Booking/create', bookingToPost);
            console.log('Booking successful:', response.data);
            // Optionally, handle the response, e.g., show a success message, reset states, etc.
        } catch (error) {
            console.error('Error during booking:', error);
            if (error.response) {
                console.error('Response data:', error.response.data); // Log the error response from the server
            }
        }
    }

    async function GetAvailableTimes(restaurantId, nrOfGuests, dateTime, setBookings) {
            setLoading(true);
        if (!restaurantId) {
            restaurantId = 1;
        }

        const formattedDate = dateTime instanceof Date ? dateTime.toISOString() : dateTime;

        try {
            console.log(`Getting available times from: https://localhost:7295/${restaurantId}/${nrOfGuests}/${formattedDate}`);
            const response = await axios.get(`https://localhost:7295/${restaurantId}/${nrOfGuests}/${formattedDate}`);
            console.log(response);
            setBookings(response.data);
            setLoading(false);

        } catch (error) {
            console.error('Error getting avaliablie times:', error);
            setLoading(false)
        }
    }

    // Hook to fetch available times when selected date or number of guests changes
    useEffect(() => {
        if (selectedNrOfPeople && selectedDate) {
            const pickedDate = new Date(selectedDate).toISOString();
            GetAvailableTimes(1, selectedNrOfPeople, pickedDate, setBookings);
        }
    }, [selectedNrOfPeople, selectedDate]); // Add dependencies

    const getDateOptions = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 60; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i);
            dates.push(nextDate.toISOString().split("T")[0]);
        }
        return dates;
    }

    const getTimeOptions = () => {
        const times = [];
        for (let i = 9; i < 20; i++) {
            const hourString = i.toString().padStart(2, "0");
            times.push(`${hourString}:00`);
            times.push(`${hourString}:30`);
        }
        return times;
    }

    const GetNameOfMonth = (dt) => {
        const date = new Date(dt);
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return month[date.getMonth()];
    }

    const dates = getDateOptions();
    const times = getTimeOptions();

    const handleNrOfPeopleClick = (nrOfPeople) => {
        setSelectedNrOfPeople(nrOfPeople);
        setSelectedDate(null); // Reset date selection
        setSelectedTime(null); // Reset time selection
        setBookings([]); // Reset bookings
    };

    const handleDateClick = (dateString) => {
        setSelectedDate(dateString);
        setSelectedTime(null); // Reset time when date changes
    };

    const handleTimeClick = (time, index) => {

        console.log("setting time : ", time)
        setSelectedTime(time);  // Still keep the Date object for internal logic
        setSelectedBooking(bookings[index]);
    };





    
    //Rendering amount of people
    const maxPeople = 8;
    const possibleNrOfPeople = [];
    for (let i = 1; i <= maxPeople; i++) {
        possibleNrOfPeople.push(
            <button key={`guest-${i}`} style={{ width: '15%', height: '15%', margin: '1px', display: 'inline', justifyContent: 'end' }} onClick={() => handleNrOfPeopleClick(i)}>
                {i}
            </button>
        )
    }


    // Rendering month and date buttons
    let lastMonth = ""; 
    const rows = [];
    let weekRow = [];

    for (let index = 0; index < dates.length; index++) {
        const dateString = dates[index];
        const date = new Date(dateString);
        const day = date.getDate();
        const dayOfWeek = date.getDay();
        const month = GetNameOfMonth(dateString);

        const isNewMonth = month !== lastMonth;
        if (isNewMonth) {
            if (weekRow.length > 0) {
                rows.push(<div key={`week-${index}`} style={{ display: 'flex', justifyContent: 'end' }}>{weekRow}</div>);
                weekRow = [];
            }
            rows.push(<h3 key={`month-${index}`} style={{ display: 'flex', justifyContent: 'center' }}>{month}</h3>);
            lastMonth = month;
        }

        weekRow.push(
            <button key={index} style={{ width: '5%', height: '5%', margin: '1px', display: 'flex', justifyContent: 'center' }} onClick={() => handleDateClick(dateString)}>
                {day}
            </button>
        );

        if (dayOfWeek === 6 || index === dates.length - 1) {
            rows.push(<div key={`week-${index}`} style={{ display: 'flex', justifyContent: 'end' }}>{weekRow}</div>);
            weekRow = [];
        }
    }


    //Rendering possible timeslots from db
    const possibleTimeSlots = [];
    for (let j = 0; j < bookings.length; j++) {
        const time = new Date(bookings[j].requestedTime); // Convert to Date object
        possibleTimeSlots.push(
            <button 
                key={bookings[j].id} 
                style={{ width: '15%', height: '15%', margin: '1px', display: 'inline', justifyContent: 'end' }} 
                onClick={() => handleTimeClick(time, j)}
            >
                {time.getHours()}:{time.getMinutes().toString().padStart(2, '0')} {/* Properly format the time */}
            </button>
        );
    }


    return (
        <div>
            <h1>Book a Table</h1>

            <div style={{ justifyContent: "center" }}>
                <h2>Select number of guests:</h2>
                <div style={{ flex :'inline',justifyContent: 'center' }}>
                    {possibleNrOfPeople}
                </div>
            </div>

            {selectedNrOfPeople && (
                <div style={{ flex :'inline',justifyContent: "center" }}>
                    <h2>Select a Date:</h2>
                    <div style={{ justifyContent: 'center' }}>
                        {rows}
                    </div>
                </div>
            )}

            {loading ? (<></> ) : selectedDate && (
                <div style={{ flex :'inline',justifyContent: "center" }}>
                    <h2>Select a Time:</h2>
                    <div style={{ justifyContent: 'center' }}>
                        {possibleTimeSlots}
                    </div>
                </div>
            )}

            {selectedTime && (
                <div style={{ maxWidth: '75%' }}>
                    <h3>Your Booking</h3>
                    <p>Number of Guests : {selectedNrOfPeople}</p>
                    <p>Date: {selectedDate}</p>
                    <p>Time: {`${selectedTime.getHours()}:${selectedTime.getMinutes().toString().padStart(2, '0')}`}</p> {/* Properly formatted */}
                    
                    <button style={{ width: '25%', height: '25%', margin: '1px', display: 'inline', justifyContent: 'end' }} onClick={() => BookTimeslot()}>
                        Book available time!
                    </button>
                </div>
            )}


            {/* save index from possible timeslot and send a post to create booking  */}
            
        </div>
    );
}
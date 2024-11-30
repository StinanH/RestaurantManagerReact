import axios from 'axios';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import VisitorsPicker from './VisitorsPicker';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import BookingButton from './BookingButton';

export default function BookingComponent() {
    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedNrOfPeople, setSelectedNrOfPeople] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Handle change in number of guests
    const handleNrOfPeopleClick = (nrOfPeople) => {
        setSelectedNrOfPeople(nrOfPeople);
        setBookings([]); // Reset bookings when number of guests changes
    };

    // Handle change of date
    const handleDateClick = (dateString) => {
        setSelectedDate(dateString);
        setSelectedTime(null); // Reset time when date changes
        setSelectedBooking(null);
    };

    // Handle time selection
    const handleTimeClick = (booking) => {
        setSelectedTime(new Date(booking.requestedTime)); 
        setSelectedBooking(booking); // Store the full booking object for the API call
    };
    // Fetch available times whenever number of guests or date changes
    useEffect(() => {
        if (selectedNrOfPeople && selectedDate) {
            setBookings([]); //clearing bookings between
            const pickedDate = new Date(selectedDate).toISOString();
            GetAvailableTimes(1, selectedNrOfPeople, pickedDate, setBookings);
        }
    }, [selectedNrOfPeople, selectedDate]);

    // Fetch available times for a given date and number of guests
    async function GetAvailableTimes(restaurantId, nrOfGuests, dateTime, setBookings) {
        setLoading(true);

        const localDate = new Date(dateTime);
        localDate.setHours(0, 0, 0, 0);  // Set to midnight in local time

        const formattedDate = format(localDate, 'yyyy-MM-dd');

        try {
            const response = await axios.get(`https://localhost:7295/${restaurantId}/${nrOfGuests}/${formattedDate}`);
            console.log(response);
            setBookings(response.data);  // Update the bookings with available times
            setLoading(false);
        } catch (error) {
            console.error('Error getting available times:', error);
            setLoading(false);
        }
    }

    // Book the selected time slot
    async function BookTimeslot() {
        const restaurantId = 1;
        const userId = 6;
        const nrOfPeople = selectedNrOfPeople;
        const requests = ''; // Empty for now

        if (!selectedTime) {
            console.error('No time selected for booking.');
            return;
        } else {
            console.log("Requested time:", selectedTime.toISOString());
        }

        const bookingToPost = {
            restaurantId: selectedBooking.restaurantId,
            requestedTime: selectedBooking.requestedTime, // Ensure correct time is posted
            userId: 6,
            nrOfPeople: selectedBooking.nrOfPeople,
            requests: '',
        };

        try {
            const response = await axios.post('https://localhost:7295/Booking/create', bookingToPost);
            
            if (typeof response.data === 'string' && response.data.toLowerCase().includes("created")){
                
                alert("Booking created successfully!"); // Display success message
                // Reset states
                setSelectedNrOfPeople(null);
                setSelectedDate(null);
                setSelectedTime(null);
                setSelectedBooking(null);
                window.location.reload();
            }

            console.log('Booking successful:', response.data);

        } catch (error) {
            console.error('Error during booking:', error);
            if (error.response) {
                console.error('Response data:', error.response.data); // Log the error response from the server
            }
        }
    }

    return (
        <div>
            <h1>Book a Table</h1>

            <div>
                <VisitorsPicker SelectedVisitors={handleNrOfPeopleClick} />
            </div>

            {selectedNrOfPeople && (
                <div>
                    <DatePicker SelectedDate={handleDateClick} />
                </div>
            )}

            {selectedDate && (
                <div>
                    <TimePicker 
                        availableTimes={bookings} 
                        onTimeSelect={handleTimeClick} 
                        selectedTime={selectedTime} // Pass selectedTime to highlight it
                        />
                </div>
            )}

            {selectedTime && selectedBooking && (
                <div>
                <BookingButton className="confirmbookingbutton" 
                selectedNrOfPeople={selectedNrOfPeople} 
                selectedDate={selectedDate} 
                selectedBooking={selectedBooking} 
                onClick={BookTimeslot}/>
                </div>
            )}
        </div>
    );
}
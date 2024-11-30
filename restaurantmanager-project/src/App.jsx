import './App.css'
import BookingSchedule from './Components/BookingSchedule'
import DatePicker from './Components/DatePicker'
import VisitorsPicker from './Components/VisitorsPicker'
import BookingComponent from './Components/BookingComponent'

function App() {

  //https://qlok.notion.site/Avancerad-fullstackutveckling-e9fb4cba2ad2406f88850d3a793b0b0c?p=ab272e661f514df79ed8837fe06d8d24&pm=s (01:50)

  const handleDateSelect = (date) => {console.log("Selected Date: ", date)}
  const handleVisitorsSelect = (visitors) => {console.log("Selected Visitors: ", visitors)}

return (
    <>

      <BookingComponent/>
      
    </>
  )
}

export default App

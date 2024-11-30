import React, { useState } from "react";

const VisitorsPicker = ({ SelectedVisitors }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);

  const handleButtonClick = (value) => {
    setSelectedAmount(value); // Update the selected value
    if (SelectedVisitors) {
      SelectedVisitors(value); // Pass value to parent if necessary
    }
  };

  return (
    <div>
      <h3>Number of Guests : </h3>
      <div className="button-container">
        <div className="Visitorrow">
          {[1, 2, 3, 4].map((value) => (
            <button
              key={value}
              className={`Visitorcolumn ${
                selectedAmount === value ? "selected" : ""
              }`}
              onClick={() => handleButtonClick(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="button-container">
        <div className="Visitorrow">
          {[5, 6, 7, 8].map((value) => (
            <button
              key={value}
              className={`Visitorcolumn ${
                selectedAmount === value ? "selected" : ""
              }`}
              onClick={() => handleButtonClick(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisitorsPicker;
import React, { useState } from 'react';
import { MdOutlineDateRange, MdClose } from "react-icons/md";
import { DayPicker } from "react-day-picker";
import { format } from 'date-fns';
import "react-day-picker/dist/style.css";

const DateSelector = ({ date, setDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center gap-2 text-sm bg-cyan-50 p-2 rounded border"
        onClick={() => setOpenDatePicker(true)}
      >
        <MdOutlineDateRange className="text-lg" />
        {date ? format(new Date(date), 'do MMM yyyy') : format(new Date(), 'do MMM yyyy')}
      </button>

      {openDatePicker && (
        <div className="absolute z-10 bg-white shadow-md p-4 mt-2 rounded">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-slate-600">Select a Date</h4>
            <button onClick={() => setOpenDatePicker(false)}>
              <MdClose className="text-lg text-gray-500" />
            </button>
          </div>
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              setOpenDatePicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DateSelector;
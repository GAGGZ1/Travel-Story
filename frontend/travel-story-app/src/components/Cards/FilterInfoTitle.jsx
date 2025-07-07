import React from "react";
import { MdOutlineClose } from "react-icons/md";
import { format } from "date-fns";

const FilterInfoTitle = ({ filterType, filterDates, onClear }) => {
  // Date chip component
  const DateRangeChip = ({ date }) => {
    const startDate = date?.from ? format(new Date(date.from), "do MMM yyyy") : "N/A";
    const endDate = date?.to ? format(new Date(date.to), "do MMM yyyy") : "N/A";

    return (
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded">
        <p className="text-xs font-medium">
          {startDate} - {endDate}
        </p>
        <button onClick={onClear}>
          <MdOutlineClose />
        </button>
      </div>
    );
  };

  // Return nothing if no filter is applied
  if (!filterType) return null;

  return (
    <div className="mb-5">
      {filterType === "search" ? (
        <h3 className="text-lg font-medium">Search Results</h3>
      ) : (
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Travel Stories from</h3>
          <DateRangeChip date={filterDates} />
        </div>
      )}
    </div>
  );
};

export default FilterInfoTitle;
import React from 'react';
import { FaHeart } from "react-icons/fa"; 
import { GrMapLocation } from "react-icons/gr";
import { format } from 'date-fns';

const TravelStoryCard = ({
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,
}) => {
  return (
    <div className='border rounded-lg overflow-hidden bg-white hover:shadow-lg cursor-pointer hover:shadow-slate-200 transition-all ease-in-out relative'>
      <img
        src={imgUrl}
        alt={title}
        className='w-full h-56 object-cover rounded-t-lg'
        onClick={onClick}
      />

      <button
        className='w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4' 
        onClick={onFavouriteClick}
      >
        <FaHeart className={`icon-btn ${isFavourite ? "text-red-500" : "text-white"}`} />
      </button>

      <div className='p-4' onClick={onClick}>
        <div className='flex items-center gap-3'>
          <div className='flex-1'>
            <h6 className='text-sm font-medium'>{title}</h6>
            <span className='text-sm text-gray-600'>
              {date ? format(new Date(date), 'dd MMM yyyy') : "Date not available"}
            </span>
          </div>
        </div>

        <p className='text-sm text-gray-600 mt-2'>
          {story?.slice(0, 60)}
        </p>

        <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
          <GrMapLocation className='text-sm' />
          <span>
            {visitedLocation?.join(", ")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
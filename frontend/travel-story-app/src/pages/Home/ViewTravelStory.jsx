import React from "react";
import { MdUpdate, MdClose } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import { format } from "date-fns";

const ViewTravelStory = ({
  storyInfo,
  onClose,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="relative">
      {/* Header Actions */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
          <button className="btn-small" onClick={onEditClick}>
            <MdUpdate className="text-lg" />
            UPDATE STORY
          </button>
          <button className="btn-small btn-delete" onClick={onDeleteClick}>
            <MdUpdate className="text-lg" />
            Delete
          </button>
          <button onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
      </div>

      {/* Story Details */}
      <div>
      <div className="flex-1 flex flex-col gap-2 py-4">
        <h1 className="text-2xl text-slate-950">{storyInfo?.title}</h1>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {storyInfo?.visitedDate &&
              format(new Date(storyInfo.visitedDate), "do MMM yyyy")}
          </span>
      

        <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded-l-lg px-2 py-1">
          <GrMapLocation className="text-sm"/>
          <span>
            {storyInfo?.visitedLocation?.join(", ")}
          </span>
        </div>
        
        
         </div>

              

      </div>

      <img 
      src={storyInfo && storyInfo.imageUrl}
      alt="Selected"
      className="w-full h-[300px] object-cover rounded-lg"/>
<div className="mt-4">
  <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">{storyInfo.story}</p></div>

      </div>
    </div>
  );
};

export default ViewTravelStory;
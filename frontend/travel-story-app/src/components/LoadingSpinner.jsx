import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
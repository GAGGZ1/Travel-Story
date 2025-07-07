import React, { useRef, useState, useEffect } from 'react';
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ImageSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPrevUrl] = useState(null);

  // Show image preview
  useEffect(() => {
    if (image && typeof image === "object") {
      const url = URL.createObjectURL(image);
      setPrevUrl(url);

      return () => URL.revokeObjectURL(url); 
    } else if (typeof image === "string") {
      setPrevUrl(image); 
    }
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

const handleRemoveImage = () => {
    setImage(null);
    setPrevUrl(null);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  return (
    <div className="p-4 border rounded flex flex-col items-center gap-3 bg-slate-50">
      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-60 object-cover rounded"
          />
          <button
            onClick={handleRemoveImage}
            className="text-red-500 flex items-center gap-1 text-sm"
          >
            <MdDeleteOutline />
            Remove Image
          </button>
        </>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            className="flex flex-col items-center justify-center gap-2 text-cyan-500 hover:underline"
            onClick={() => inputRef.current.click()}
          >
            <FaRegFileImage className="text-2xl" />
            <p className="text-sm text-slate-500">Browse Image files to upload</p>
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSelector;